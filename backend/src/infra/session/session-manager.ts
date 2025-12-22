import { CookieJar } from "tough-cookie";
import NodeCache from "node-cache";
import { randomUUID } from "node:crypto";

const cache = new NodeCache({ stdTTL: 7200 })

interface Session {
    sessionId: string,
    sessionCookieJar: CookieJar
}

export class SessionManager {
    static createSession() {
        const session = {
            sessionId: randomUUID(),
            sessionCookieJar: new CookieJar()
        }

        return session
    }

    static saveSession({ sessionId, sessionCookieJar }: Session) {
        cache.set(`${sessionId}`, sessionCookieJar)
    }

    static getSession(sessionId: string): Session {
        const sessionCookieJar = cache.get(sessionId) as CookieJar

        if (!sessionCookieJar) return {
            sessionId: randomUUID(),
            sessionCookieJar: new CookieJar()
        }

        return { 
            sessionId,
            sessionCookieJar
        }
    }
}