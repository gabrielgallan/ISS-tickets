import { AuthenticateMemberService } from "@/core/iss-partner/services/authenticate/authenticate";
import { InternalServerError } from "@/core/iss-partner/services/errors/internal-server-error";
import { InvalidCredentialsError } from "@/core/iss-partner/services/errors/invalid-credentials";
import { InvalidPortalUrlError } from "@/core/iss-partner/services/errors/invalid-portal-url";
import { NodeCryptoEncrypter } from "@/infra/encrypter/node-crypto/node-crypto-encrypter";
import env from "@/infra/env/config";
import { makeSessionManager } from "@/infra/session/factories/make-session-manager";
import { SessionManager } from "@/infra/session/session";
import { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";

export async function authenticate(request: FastifyRequest, reply: FastifyReply) {
    const bodySchema = z.object({
        email: z.string(),
        password: z.string()
    })

    const { email, password } = bodySchema.parse(request.body)

    try {
        const sessionManager = makeSessionManager()
        
        // -> Create
        const session = await sessionManager.createSession()

        const { cookieJar } = await new AuthenticateMemberService(session.jar)
            .execute(
                {
                    email,
                    password
                })

        // -> Save
        await sessionManager.saveSession({
            key: session.key,
            jar: cookieJar
        })

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