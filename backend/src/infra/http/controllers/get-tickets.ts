import { PortalApi } from "@/core/iss-partner/services/authenticate/api/portal-api";
import { UnauthorizedMemberError } from "@/core/iss-partner/services/errors/unauthorized-member";
import { FetchTicketInfoService } from "@/core/iss-partner/services/fetch-ticket-info/fetch-ticket-info";
import { GetTicketsService } from "@/core/iss-partner/services/get-tickets/get-tickets";
import { SessionManager } from "@/infra/session/session-manager";
import env from "@/infra/env/config";
import { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";

export async function getTickets(request: FastifyRequest, reply: FastifyReply) {
    try {
        const sessionId = request.cookies.sessionId as string

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

        const { 
            searchField, 
            searchValue,
            ticketStateIds,
            ticketPriorityIds,
            ticketTypeIds,
            perPage, 
            page 
        } = querySchema.parse(request.query)

        const { sessionCookieJar } = SessionManager.getSession(sessionId)

        const apiAuthenticated = await PortalApi.create(sessionCookieJar)

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
        if (err instanceof UnauthorizedMemberError) {
            return reply.status(401).send({ error: err.message })
        }

        throw err
    }
}