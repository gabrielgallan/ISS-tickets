import { AxiosError, AxiosInstance } from 'axios'
import qs from 'qs'

import { IssGetTicketsResponseDTO } from '../../dto/get-tickets-response.dto'
import { Ticket } from '@/core/model/ticket'
import { TicketsMapper } from '../../mappers/ticket-mapper'
import { UnauthorizedMemberError } from '../errors/unauthorized-member'
import { InternalServerError } from '../errors/internal-server-error'

interface GetTicketsServiceRequest {
    searchField: TicketSearchFields
    searchValue: string
    filters: TicketFilters
    perPage: number
    page: number
}

interface GetTicketsServiceResponse {
    tickets: Ticket[]
    rawResponse: IssGetTicketsResponseDTO
}

type TicketSearchFields = 'tn' | 'title' | 'a_body' | 'company' | 'customer_user_id' | 'login'

interface TicketFilters {
    ticketStateIds: number[]
    ticketPriorityIds: number[]
    ticketTypeIds: number[]
}

export class GetTicketsService {
    constructor(
        private apiAuthenticated: AxiosInstance
    ) { }

    async execute({
        searchField,
        searchValue,
        filters,
        perPage,
        page
    }: GetTicketsServiceRequest): Promise<GetTicketsServiceResponse> {
        try {

            const paramsFilters = {
                ticket_state_id: filters.ticketStateIds,
                ticket_priority_id: filters.ticketPriorityIds,
                ticket_type: filters.ticketTypeIds,

            }

            const apiResponse = await this.apiAuthenticated.get('/agent/get-tickets', {
                params: {
                    filters: paramsFilters,
                    sorting: [
                        {
                            sort_key: "create_time",
                            sort_value: "DESC"
                        }
                    ],
                    search: {
                        value: (searchValue && searchField) ? encodeURIComponent(searchValue) : '',
                        field: (searchValue && searchField) ? searchField : 'tn'
                    },
                    my_tickets: 0,
                    per_page: perPage,
                    page: page
                },
                paramsSerializer: params => qs.stringify(params, { encode: false })
            })

            const rawResponse = apiResponse.data as IssGetTicketsResponseDTO

            const tickets = rawResponse.tickets.data.map((ticket) => TicketsMapper.toEntity(ticket, rawResponse))

            return {
                tickets,
                rawResponse
            }
        } catch (err: any) {
            if (err instanceof AxiosError) {
                if (err.response?.status === 409) throw new UnauthorizedMemberError()
                if (err.response?.status === 401) throw new UnauthorizedMemberError()
            }

            throw new InternalServerError(err.message)
        }
    }
}