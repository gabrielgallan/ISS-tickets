import { IssTicketDTO } from "./get-tickets-response.dto"

export interface IssFetchTicketResponseDTO {
    component: string,
    props: IssTicketPropsDTO,
    url: string,
    version: string,
    clearHistory: boolean,
    encryptHistory: boolean
}

interface IssTicketPropsDTO {
    ticketInfo: {
        ticket_region: string,
        ticket: IssTicketDTO,
        client: IssCustomerDTO
    }
}

export interface IssCustomerDTO {
  id: number
  cu_azure_id: number | null
  login: string
  email: string
  customer_id: string
  coe_groomer: number | null
  cu_saas_agent: number | null
  ivs_agent: number | null
  uno_agent: number | null
  coe_agent: number | null
  coe_statistic: number | null
  coe_admin: number | null
  cu_brain: number | null
  cu_eventsrnd: number | null
  coe_rnd: number
  coe_content_add_props: number | null
  coe_content: number
  coe_region_filter: number | null
  title: string
  first_name: string
  last_name: string
  phone: string | null
  fax: string | null
  cu_guest: number
  mobile: string | null
  street: string | null
  zip: string | null
  city: string | null
  country: string | null
  comments: string | null
  valid_id: number
  create_time: string
  create_by: number
  change_time: string
  change_by: number
  counter_error: string
  third_name: string | null
  cu_lang: string
  cu_approve: number
  cu_region: number
  country_id: number
  cu_checkout: string | null
  cu_counter: number
  cu_need_exam: number | null
  is_verifier: number | null
  company: string | null
  address: string | null
  user_region: number | null
  flag_uvss_rel_notes: number | null
  flag_coe_vid: number | null
  sdt_user_rights: number | null
  ivs_admin: number | null
  bank_authorize_profile_id: number | null
}