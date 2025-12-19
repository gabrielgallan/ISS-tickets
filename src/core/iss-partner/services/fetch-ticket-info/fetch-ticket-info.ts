import { AxiosInstance } from "axios"
import { IssFetchTicketResponseDTO } from "../../dto/fetch-ticket-response.dto"

interface FetchTicketInfoServiceRequest {
    ticketId: number
}

interface FetchTicketInfoServiceResponse {
    data: IssFetchTicketResponseDTO
}

export class FetchTicketInfoService {
    constructor(
        private apiAuthenticated: AxiosInstance
    ) { }

    async execute({
        ticketId
    }: FetchTicketInfoServiceRequest): Promise<FetchTicketInfoServiceResponse> {
        const apiResponse = await this.apiAuthenticated.get(`/en/agent/ticket/${ticketId}`,
            {
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-Inertia': 'true',
                    'X-Inertia-Version': 'fb12e86b8782ee633c8793c6a631aaf9',
                    'Accept': 'application/json'
                }
            }
        )

        return {
            data: apiResponse.data
        }
    }
}