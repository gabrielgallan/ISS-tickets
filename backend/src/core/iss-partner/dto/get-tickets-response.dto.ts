import { TicketPriority, TicketStatus, TicketType } from "../config/tickets-info"

export interface IssGetTicketsResponseDTO {
    tickets: {
        current_page: number
        data: IssTicketDTO[]
        first_page_url: string
        from: number
        last_page: number
        last_page_url: string
        links: any[]
        next_page_url: string
        path: string
        per_page: number
        prev_page_url: string
        to: number
        total: number
    }
    agents: Record<string, string>,
    projects: any[]
}

export interface IssTicketDTO {
  id: number
  tn: string
  title: string

  queue_id: number
  ticket_lock_id: number
  type_id: number
  service_id: number | null
  sla_id: number | null

  user_id: number
  responsible_user_id: number
  ticket_priority_id: keyof typeof TicketPriority
  ticket_state_id: keyof typeof TicketStatus
  cu_id: number

  customer_id: string
  customer_user_id: string
  cc_id: number | null

  timeout: number
  until_time: number

  escalation_time: number
  escalation_update_time: number
  escalation_response_time: number
  escalation_solution_time: number

  archive_flag: number

  create_time_unix: number
  create_time: string // ISO datetime
  create_by: number

  change_time: string // ISO datetime
  change_by: number

  ticket_type: keyof typeof TicketType
  comment: string | null
  status: string | null

  cp_id: string           // vem string, ex '0'
  region_id: string       // pode vir ''
  country_id: number
  iss_region_id: number

  first_answer_time: number
  resolved_time: number | null
  sum_time_agent: number | null
  sum_time_user: number | null
}
