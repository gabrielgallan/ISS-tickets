import { EncryptedSession } from "@/infra/session/session";
import { SessionsRepository } from "../sessions-repository";

export class InMemorySessionsRepository implements SessionsRepository {
    private items: EncryptedSession[] = []

    async create(session: EncryptedSession) {
        this.items.push(session)

        return session
    }

    async findByKey(key: string) {
        const session = this.items.find(item => item.key === key)

        return session || null
    }

    async save(session: EncryptedSession) {
        const index = this.items.findIndex(item => item.key === session.key)

        if (index === -1) {
            throw new Error('Session not found')
        }

        this.items[index] = session

        return session
    }
}

export const inMemorySessionsRepository = new InMemorySessionsRepository()