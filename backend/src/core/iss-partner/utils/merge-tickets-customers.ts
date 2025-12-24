import { Customer } from "@/core/model/customer";
import { Ticket } from "@/core/model/ticket";
import { GetTicketCustomerServiceResponse } from "../services/get-tickets-customers.ts/get-tickets-customers";

interface MergeRequest {
    tickets: Ticket[],
    getTicketsCustomersResponse: GetTicketCustomerServiceResponse[]
}

interface MergeResponse {
    mergedTickets: {
        ticketInfo: Ticket,
        customerInfo: Customer | null
    }[]
}

export function mergeTicketsToCustomers({
    tickets,
    getTicketsCustomersResponse
}: MergeRequest): MergeResponse {
    const mergedTickets = tickets.map((ticket) => {
        const customer = getTicketsCustomersResponse.find(response => response.ticketPkId === ticket.pkId)?.customer

        return {
            ticketInfo: ticket,
            customerInfo: customer ?? null
        }
    })

    return {
        mergedTickets
    }
}