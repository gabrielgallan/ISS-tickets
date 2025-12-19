import { AuthenticateMemberService } from "@/core/iss-partner/services/authenticate/authenticate";
import { GetTicketsService } from "@/core/iss-partner/services/get-tickets/get-tickets";
import env from "@/infra/env/config";
import { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";

export async function getTickets(request: FastifyRequest, reply: FastifyReply) {
    try {
        const { apiAuthenticated } = await new AuthenticateMemberService().execute({
            email: env.ISS_PORTAL_EMAIL,
            password: env.ISS_PORTAL_PASSWORD,
        })

        const { data } = await new GetTicketsService(apiAuthenticated).execute({
            searchField: 'tn',
            searchValue: '',
            perPage: 10,
            page: 1
        })

        return reply.status(200).send({ tickets: data.tickets })
    } catch (err: any) {
        console.error(err)
        return reply.status(500).send({ error: err.message })
    }
}