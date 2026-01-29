import { SessionManager } from "@/infra/session/session"
import { FastifyReply, FastifyRequest } from "fastify"
import { PortalApi } from "@/core/iss-partner/services/authenticate/api/portal-api"
import { makeSessionManager } from "@/infra/session/factories/make-session-manager"

export async function refresh(request: FastifyRequest, reply: FastifyReply) {
    try {
        await request.jwtVerify({ onlyCookie: true })
    } catch (err) {
        return reply.status(401).send({ error: 'Unauthorized, session expired!' })
    }

    const { key } = request.user.sign

    const sessionManager = makeSessionManager()

    const session = await sessionManager.getSessionByKey(key)

    if (!session) {
        return reply.status(401).send({ error: 'Unauthorized, session not found!' })
    }

    const token = await reply.jwtSign(
        {
            sign: {
                key: session.key
            }
        }
    )

    const refreshToken = await reply.jwtSign(
        {
            sign: {
                key: session.key,
                expiresIn: '7d'
            }
        }
    )

    return reply
        .setCookie('refreshToken', refreshToken, {
            path: '/',
            httpOnly: true,
            secure: true,
            sameSite: true
        })
        .status(200).send({
            success: true,
            data: {
                token
            }
        })
}