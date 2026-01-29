import { PortalApi } from "@/core/iss-partner/services/authenticate/api/portal-api";
import { UnauthorizedMemberError } from "@/core/iss-partner/services/errors/unauthorized-member";
import { GetTicketCustomerService } from "@/core/iss-partner/services/get-tickets-customers.ts/get-tickets-customers";
import { GetTicketsService } from "@/core/iss-partner/services/get-tickets/get-tickets";
import { SessionManager } from "@/infra/session/session";
import env from "@/infra/env/config";
import { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import { mergeTicketsToCustomers } from "@/core/iss-partner/utils/merge-tickets-customers";
import { makeSessionManager } from "@/infra/session/factories/make-session-manager";
import { logger } from "@/infra/logger";
import { NodeCryptoEncrypter } from "@/infra/encrypter/node-crypto/node-crypto-encrypter";

export async function getTickets(request: FastifyRequest, reply: FastifyReply) {
    try {
        const sessionKey = request.user.sign.key

        const sessionManager = makeSessionManager()

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
            startDate: z.coerce.date().optional(),
            endDate: z.coerce.date().optional(),
            perPage: z.coerce.number().default(10),
            page: z.coerce.number().default(1),
        })

        const { 
            searchField, 
            searchValue,
            ticketStateIds,
            ticketPriorityIds,
            ticketTypeIds,
            startDate,
            endDate,
            perPage, 
            page 
        } = querySchema.parse(request.query)

        const session = await sessionManager.getSessionByKey(sessionKey)

        if (!session) {
            return reply.status(401).send({ error: 'Unauthorized, session not found!' })
        }

        const apiAuthenticated = await PortalApi.create(session.jar)

        const { tickets } = await new GetTicketsService(apiAuthenticated).execute({
            searchField,
            searchValue,
            filters: {
                ticketStateIds,
                ticketPriorityIds,
                ticketTypeIds
            },
            timestamp: startDate && endDate ? {
                start: startDate,
                end: endDate
            } : undefined,
            perPage,
            page
        })

        const getTicketCustomerService = new GetTicketCustomerService(apiAuthenticated)

        const getTicketsCustomersResponse = await Promise.all(
            tickets.map(async ticket => await getTicketCustomerService.execute({ ticket }))
        )

        const { mergedTickets } = mergeTicketsToCustomers({
            tickets,
            getTicketsCustomersResponse
        })

        return reply.status(200).send({
            success: true,
            data: { tickets: mergedTickets }
        })
    } catch (err: any) {
        if (err instanceof UnauthorizedMemberError) {
            return reply.status(401).send({
                success: false,
                error: {
                    code: 'UNAUTHORIZED_MEMBER',
                    message: err.message
                }
            })
        }

        throw err
    }
}