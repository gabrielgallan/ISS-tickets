import { writeFile } from 'node:fs/promises'
import { AuthenticateMemberService } from './core/iss-partner/services/authenticate/authenticate'
import { FetchTicketInfoService } from './core/iss-partner/services/fetch-ticket-info/fetch-ticket-info'
import { GetTicketsService } from './core/iss-partner/services/get-tickets/get-tickets'

import env from './infra/env/config'
import { startHttpServer } from './infra/http/server'
import { TicketPriority, TicketStatus, TicketType } from './core/iss-partner/config/tickets-info'

async function main() {
  try {
    const authenticateMemberService = new AuthenticateMemberService()

    const { apiAuthenticated } = await authenticateMemberService.execute({
      email: env.ISS_PORTAL_EMAIL,
      password: env.ISS_PORTAL_PASSWORD,
    })


    const { tickets } = await new GetTicketsService(apiAuthenticated).execute({
      searchField: null,
      searchValue: null,
      perPage: 25,
      page: 1
    })

    const fetchTicketInfoService = new FetchTicketInfoService(apiAuthenticated)

    const tikcetsInfo = await Promise.all(
      tickets.map(async ticket => await fetchTicketInfoService.execute({ ticketId: ticket.pkId }))
    )

    const CTickets = tickets.map(ticket => {
      let customer
      const info = tikcetsInfo.find(t => t.rawResponse.props.ticketInfo.ticket.id === ticket.pkId)

      if (!info) customer = 'Customer not found'
      else customer = info.customer

      return {
        ticket,
        customer,
      }
    })

    console.log(CTickets)
  } catch (err) {
    console.error(err)
  }
}

// main()

startHttpServer()