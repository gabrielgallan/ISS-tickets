import { EncryptedSession, Session } from "../session/session"

export interface SessionsRepository {
    create(session: EncryptedSession): Promise<EncryptedSession>
    findByKey(key: string): Promise<EncryptedSession | null>
    save(session: EncryptedSession): Promise<EncryptedSession>
    // update(session: Session): Promise<void>
    // delete(id: string): Promise<void>
}