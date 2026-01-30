import { NodeCryptoEncrypter } from "@/infra/encrypter/node-crypto/node-crypto-encrypter";
import { SessionManager } from "../session";
import { inMemorySessionsRepository } from "@/infra/repositories/in-memory/in-memory-sessions-repository";
import { RedisSessionsRepository } from "@/infra/repositories/redis/redis-sessions-repository";

export function makeSessionManager() {
    return new SessionManager(
        new NodeCryptoEncrypter(),
        new RedisSessionsRepository()
    )
}