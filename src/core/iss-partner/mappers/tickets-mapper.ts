import { Ticket } from "@/core/model/tickets";
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
            new Date(rawTicket.create_time).toLocaleString('pt-BR'),
            rawTicket.change_time,
            new Date(rawTicket.change_time).toLocaleString('pt-BR'),
            rawResponse.agents[rawTicket.user_id],
            rawTicket.user_id
        )
    }
}