import { AxiosInstance } from "axios"
import { IssFetchTicketResponseDTO } from "../../dto/fetch-ticket-response.dto"
import { Customer } from "@/core/model/customer"
import { CustomerMapper } from "../../mappers/customer-mapper"
import { Ticket } from "@/core/model/ticket"

interface GetTicketCustomerServiceRequest {
    ticket: Ticket
}

export interface GetTicketCustomerServiceResponse {
    ticketPkId: number
    customer: Customer
    rawResponse: IssFetchTicketResponseDTO
}

export class GetTicketCustomerService {
    constructor(
        private apiAuthenticated: AxiosInstance
    ) { }

    async execute({
        ticket
    }: GetTicketCustomerServiceRequest): Promise<GetTicketCustomerServiceResponse> {
        const apiResponse = await this.apiAuthenticated.get(`/en/agent/ticket/${ticket.pkId}`,
            {
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-Inertia': 'true',
                    'X-Inertia-Version': 'fb12e86b8782ee633c8793c6a631aaf9',
                    'Accept': 'application/json'
                }
            }
        )

        const rawResponse = apiResponse.data as IssFetchTicketResponseDTO

        const customer = CustomerMapper.toEntity(rawResponse.props.ticketInfo.client)

        return {
            ticketPkId: ticket.pkId,
            customer,
            rawResponse,
        }
    }
}