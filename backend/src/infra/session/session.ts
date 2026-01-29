import { randomUUID } from "node:crypto"
import { Encrypter } from "../encrypter/encrypter"
import { SessionsRepository } from "../repositories/sessions-repository"
import { CookieJar } from "tough-cookie"

export interface Session {
    key: string
    jar: CookieJar
}

export interface EncryptedSession {
    key: string
    jar: string
}

export class SessionManager {
    constructor(
        private encrypter: Encrypter,
        private sessionsRepository: SessionsRepository
    ) { }

    async createSession() {
        const session: Session = {
            key: randomUUID(),
            jar: new CookieJar()
        }

        const jsonCookieJar = JSON.stringify(session.jar.serializeSync())

        const encryptedSession: EncryptedSession = {
            key: session.key,
            jar: this.encrypter.encrypt(jsonCookieJar)
        }

        const createdSession = await this.sessionsRepository.create(encryptedSession)

        return session
    }

    async saveSession(session: Session) {
        const jsonCookieJar = JSON.stringify(session.jar.serializeSync())

        const encryptedSession: EncryptedSession = {
            key: session.key,
            jar: this.encrypter.encrypt(jsonCookieJar)
        }

        const savedSession = await this.sessionsRepository.save(encryptedSession)

        return savedSession
    }

    async getSessionByKey(key: string) {
        const encryptedSession = await this.sessionsRepository.findByKey(key)

        if (!encryptedSession) {
            return null
        }

        const decryptedJar = this.encrypter.decrypt(encryptedSession.jar)

        const cookieJar = CookieJar.deserializeSync(decryptedJar)

        return {
            key,
            jar: cookieJar
        }
    }
}