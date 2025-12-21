import { AxiosError, AxiosInstance } from 'axios'
import qs from 'qs'

import { IssGetTicketsResponseDTO } from '../../dto/get-tickets-response.dto'
import { Ticket } from '@/core/model/tickets'
import { TicketsMapper } from '../../mappers/tickets-mapper'
import { UnauthorizedMemberError } from '../errors/unauthorized-member'
import { InternalServerError } from '../errors/internal-server-error'

interface GetTicketsServiceRequest {
    searchField: TicketSearchFields | null,
    searchValue: string | null,
    perPage: number,
    page: number
}

interface GetTicketsServiceResponse {
    tickets: Ticket[]
    rawResponse: IssGetTicketsResponseDTO
}

type TicketSearchFields = 'tn' | 'title' | 'a_body' | 'company' | 'customer_user_id' | 'login'

export class GetTicketsService {
    constructor(
        private apiAuthenticated: AxiosInstance
    ) { }

    async execute({
        searchField,
        searchValue,
        perPage,
        page
    }: GetTicketsServiceRequest): Promise<GetTicketsServiceResponse> {
        try {
            const apiResponse = await this.apiAuthenticated.get('/agent/get-tickets', {
                params: {
                    filters: {
                        ticket_state_id: [],
                        ticket_priority_id: [],
                        ticket_type: [],

                    },
                    sorting: [
                        {
                            sort_key: "create_time",
                            sort_value: "DESC"
                        }
                    ],
                    search: {
                        value: (searchValue && searchField) ? searchValue : '',
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
            }

            throw new InternalServerError(err.message)
        }
    }
}