export class GetTicketInfoService {
    constructor(api) {
        this.api = api
    }

    async execute(ticketId) {
        const apiResponse = await this.api.get(`/en/agent/ticket/${ticketId}`)

        return apiResponse.data
    }
}