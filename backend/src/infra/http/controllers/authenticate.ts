import { AuthenticateMemberService } from "@/core/iss-partner/services/authenticate/authenticate";
import { InternalServerError } from "@/core/iss-partner/services/errors/internal-server-error";
import { InvalidCredentialsError } from "@/core/iss-partner/services/errors/invalid-credentials";
import { InvalidPortalUrlError } from "@/core/iss-partner/services/errors/invalid-portal-url";
import { NodeCryptoEncrypter } from "@/infra/encrypter/node-crypto/node-crypto-encrypter";
import env from "@/infra/env/config";
import { makeSessionManager } from "@/infra/session/factories/make-session-manager";
import { Session, SessionManager } from "@/infra/session/session";
import { getSessionFromRefreshToken } from "@/infra/utils/verify-session";
import { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";

export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const bodySchema = z.object({
    email: z.string(),
    password: z.string(),
  })

  const { email, password } = bodySchema.parse(request.body)

  const sessionManager = makeSessionManager()

  let session: Session

  // 🔐 1. tenta reaproveitar sessão via refresh token
  const existingSession = await getSessionFromRefreshToken(
    request,
    sessionManager
  )

  if (existingSession) {
    session = existingSession
  } else {
    session = await sessionManager.createSession()
  }

  try {
    // 🔐 2. autentica no portal usando a sessão correta
    const { cookieJar } = await new AuthenticateMemberService(session.jar)
      .execute({ email, password })

    // 💾 3. salva sessão
    await sessionManager.saveSession({
      key: session.key,
      jar: cookieJar,
    })

    // 🔑 4. gera tokens
    const token = await reply.jwtSign(
      { key: session.key },
      { expiresIn: '1h' }
    )

    const refreshToken = await reply.jwtSign(
      { key: session.key },
      { expiresIn: '7d' }
    )

    // 🍪 5. responde
    return reply
      .setCookie('refreshToken', refreshToken, {
        path: '/',
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
      })
      .status(200)
      .send({
        success: true,
        data: { token },
      })
  } catch (err) {
    if (err instanceof InvalidCredentialsError) {
      return reply.status(422).send({
        success: false,
        error: {
          code: 'INVALID_CREDENTIALS',
          message: err.message,
        },
      })
    }

    if (err instanceof InvalidPortalUrlError) {
      return reply.status(500).send({
        success: false,
        error: {
          code: 'INVALID_PORTAL_URL',
          message: err.message,
        },
      })
    }

    if (err instanceof InternalServerError) {
      return reply.status(500).send({
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: err.message,
        },
      })
    }

    throw err
  }
}