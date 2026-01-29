import { AuthenticateMemberService } from "@/core/iss-partner/services/authenticate/authenticate";
import { InternalServerError } from "@/core/iss-partner/services/errors/internal-server-error";
import { InvalidCredentialsError } from "@/core/iss-partner/services/errors/invalid-credentials";
import { InvalidPortalUrlError } from "@/core/iss-partner/services/errors/invalid-portal-url";
import env from "@/infra/env/config";
import { SessionManager } from "@/infra/session/session-manager";
import { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";

export async function authenticate(request: FastifyRequest, reply: FastifyReply) {
    try {
        const bodySchema = z.object({
            email: z.string(),
            password: z.string()
        })

        const { email, password } = bodySchema.parse(request.body)

        const {
            sessionId,
            sessionCookieJar
        } = SessionManager.createSession()

        const { cookieJar } = await new AuthenticateMemberService(sessionCookieJar).execute({
            email,
            password
        })

        SessionManager.saveSession({
            sessionId,
            sessionCookieJar: cookieJar
        })

        return reply
            .setCookie('sessionId', sessionId, {
                httpOnly: true,
                secure: true,
                sameSite: env.NODE_ENV === 'production' ? 'lax' : 'none',
                path: "/"
            })
            .status(201)
            .send({
                success: true,
                data: {}
            })
    } catch (err: any) {
        if (err instanceof InvalidCredentialsError) {
            return reply.status(422).send({
                success: false,
                error: {
                    code: 'INVALID_CREDENTIALS',
                    message: err.message
                }
            })
        }
        if (err instanceof InvalidPortalUrlError) {
            return reply.status(500).send({
                success: false,
                error: {
                    code: 'INVALID_PORTAL_URL',
                    message: err.message
                }
            })
        }
        if (err instanceof InternalServerError) {
            return reply.status(500).send({
                success: false,
                error: {
                    code: 'INTERNAL_SERVER_ERROR',
                    message: err.message
                }
            })
        }

        throw err
    }
}