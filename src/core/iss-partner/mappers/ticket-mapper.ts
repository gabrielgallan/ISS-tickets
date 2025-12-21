import { Ticket } from "@/core/model/ticket";
import { IssGetTicketsResponseDTO, IssTicketDTO } from "../dto/get-tickets-response.dto";
import { TicketPriority, TicketStatus, TicketType } from "../config/tickets-info";

export class TicketsMapper {
    public static toEntity(
        rawTicket: IssTicketDTO, 
        rawResponse: IssGetTicketsResponseDTO
    ): Ticket {
        return new Ticket(
            rawTicket.id,
            rawTicket.tn,
            rawTicket.title,
            TicketPriority[rawTicket.ticket_priority_id],
            TicketType[rawTicket.ticket_type],
            TicketStatus[rawTicket.ticket_state_id],
            rawTicket.create_time,
            rawTicket.change_time,
            rawResponse.agents[rawTicket.user_id],
            rawTicket.user_id
        )
    }
}