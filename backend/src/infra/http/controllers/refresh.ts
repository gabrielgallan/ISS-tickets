import { SessionManager } from "@/infra/session/session-manager";
import { FastifyReply, FastifyRequest } from "fastify";
import { PortalApi } from "@/core/iss-partner/services/authenticate/api/portal-api";

export async function refresh(request: FastifyRequest, reply: FastifyReply) {
    const sessionId = request.cookies.sessionId as string

    const { sessionCookieJar } = SessionManager.getSession(sessionId)

    console.log(sessionCookieJar.serializeSync())

    const api = await PortalApi.create(sessionCookieJar)

    await api.get('/')

    console.log(sessionCookieJar.serializeSync())

    SessionManager.saveSession({
        sessionId,
        sessionCookieJar
    })

    return reply.status(204).send({
        success: true,
        data: {}
    })
}