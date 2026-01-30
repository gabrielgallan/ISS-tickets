import { FastifyRequest } from "fastify"
import { SessionManager } from "../session/session"
import { Session } from "../session/session"

export async function getSessionFromRefreshToken(
  request: FastifyRequest,
  sessionManager: SessionManager
): Promise<Session | null> {
  try {
    await request.jwtVerify({ onlyCookie: true })

    const sessionKey = request.user.key
    return await sessionManager.getSessionByKey(sessionKey)
  } catch {
    return null
  }
}
