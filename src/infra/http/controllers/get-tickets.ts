import { AuthenticateMemberService } from "@/core/iss-partner/services/authenticate/authenticate";
import { InternalServerError } from "@/core/iss-partner/services/errors/internal-server-error";
import { InvalidCredentialsError } from "@/core/iss-partner/services/errors/invalid-credentials";
import { InvalidPortalUrlError } from "@/core/iss-partner/services/errors/invalid-portal-url";
import { UnauthorizedMemberError } from "@/core/iss-partner/services/errors/unauthorized-member";
import { FetchTicketInfoService } from "@/core/iss-partner/services/fetch-ticket-info/fetch-ticket-info";
import { GetTicketsService } from "@/core/iss-partner/services/get-tickets/get-tickets";
import env from "@/infra/env/config";
import { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";

export async function getTickets(request: FastifyRequest, reply: FastifyReply) {
    try {
        const querySchema = z.object({
            searchField: z.enum(['tn', 'title', 'a_body', 'company', 'customer_user_id', 'login']).optional(),
            searchValue: z.string().optional(),
            perPage: z.coerce.number(),
            page: z.coerce.number(),
        })

        const { searchField, searchValue, perPage, page } = querySchema.parse(request.query)

        const { apiAuthenticated } = await new AuthenticateMemberService().execute({
            email: env.ISS_PORTAL_EMAIL,
            password: env.ISS_PORTAL_PASSWORD,
        })

        const { tickets } = await new GetTicketsService(apiAuthenticated).execute({
            searchField: searchField ?? null,
            searchValue: searchValue ?? null,
            perPage,
            page
        })

        const fetchTicketInfoService = new FetchTicketInfoService(apiAuthenticated)

        const tikcetsInfo = await Promise.all(
            tickets.map(async ticket => await fetchTicketInfoService.execute({ ticketId: ticket.pkId }))
        )

        const CTickets = tickets.map(ticket => {
            let customer
            const info = tikcetsInfo.find(t => t.rawResponse.props.ticketInfo.ticket.id === ticket.pkId)

            if (!info) customer = 'Customer not found'
            else customer = info.customer

            return {
                ticket,
                customer,
            }
        })

        return reply.status(200).send({ CTickets })
    } catch (err: any) {
        if (err instanceof InvalidCredentialsError) {
            return reply.status(422).send({ error: err.message })
        }
        if (err instanceof InvalidPortalUrlError) {
            return reply.status(500).send({ error: err.message })
        }
        if (err instanceof InternalServerError) {
            return reply.status(500).send({ error: err.message })
        }
        if (err instanceof UnauthorizedMemberError) {
            return reply.status(409).send({ error: err.message })
        }

        throw err
    }
}