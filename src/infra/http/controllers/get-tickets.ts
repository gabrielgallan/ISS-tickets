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
            searchField: z.enum(['tn', 'title', 'a_body', 'company', 'customer_user_id', 'login']).default('tn'),
            searchValue: z.string().default(''),
            ticketStateIds:
                z.string()
                    .optional()
                    .transform(val =>
                        val ? val.split(',').map(v => Number(v)).filter(n => !isNaN(n)) : []
                    ),
            ticketPriorityIds:
                z.string()
                    .optional()
                    .transform(val =>
                        val ? val.split(',').map(v => Number(v)).filter(n => !isNaN(n)) : []
                    ),
            ticketTypeIds:
                z.string()
                    .optional()
                    .transform(val =>
                        val ? val.split(',').map(v => Number(v)).filter(n => !isNaN(n)) : []
                    ),
            perPage: z.coerce.number().default(10),
            page: z.coerce.number().default(1),
        })

        // const bodySchema = z.object({
        //     email: z.string(),
        //     password: z.string()
        // })

        const { 
            searchField, 
            searchValue,
            ticketStateIds,
            ticketPriorityIds,
            ticketTypeIds,
            perPage, 
            page 
        } = querySchema.parse(request.query)

        // const { email, password } = bodySchema.parse(request.body)

        const { apiAuthenticated } = await new AuthenticateMemberService().execute({
            email: env.ISS_PORTAL_EMAIL,
            password: env.ISS_PORTAL_PASSWORD
        })


        const { tickets } = await new GetTicketsService(apiAuthenticated).execute({
            searchField,
            searchValue,
            filters: {
                ticketStateIds,
                ticketPriorityIds,
                ticketTypeIds
            },
            perPage,
            page
        })

        // const fetchTicketInfoService = new FetchTicketInfoService(apiAuthenticated)

        // const tikcetsInfo = await Promise.all(
        //     tickets.map(async ticket => await fetchTicketInfoService.execute({ ticketId: ticket.pkId }))
        // )

        // const CTickets = tickets.map(ticket => {
        //     let customer
        //     const info = tikcetsInfo.find(t => t.rawResponse.props.ticketInfo.ticket.id === ticket.pkId)

        //     if (!info) customer = 'Customer not found'
        //     else customer = info.customer

        //     return {
        //         ticket,
        //         customer,
        //     }
        // })

        return reply.status(200).send({ tickets })
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