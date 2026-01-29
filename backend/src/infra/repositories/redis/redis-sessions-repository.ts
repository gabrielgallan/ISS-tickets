import { EncryptedSession } from "@/infra/session/session";
import { SessionsRepository } from "../sessions-repository";
import { redis } from "@/infra/lib/redis";

export class RedisSessionsRepository implements SessionsRepository {
    async create(session: EncryptedSession) {
        const expiresInDays = 2

        await redis.set(
            session.key, 
            session.jar,
            { EX: 60 * 60 * 24 * expiresInDays }
        )

        return session
    }

    async findByKey(key: string) {
        const session = await redis.get(key)

        if (!session) return null

        return {
            key,
            jar: session
        }
    }

    async save(session: EncryptedSession) {
        const expiresInDays = 7

        await redis.set(
            session.key, 
            session.jar,
            { EX: 60 * 60 * 24 * expiresInDays }
        )

        return session
    }
}