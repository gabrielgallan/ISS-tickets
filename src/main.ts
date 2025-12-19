import { writeFile } from 'node:fs/promises'
import { AuthenticateMemberService } from './core/iss-partner/services/authenticate/authenticate'
import { FetchTicketInfoService } from './core/iss-partner/services/fetch-ticket-info/fetch-ticket-info'
import { GetTicketsService } from './core/iss-partner/services/get-tickets/get-tickets'

import env from './infra/env/config'
import { startHttpServer } from './infra/http/server'
import { write } from 'node:fs'

async function main() {
  try {
    const { apiAuthenticated } = await new AuthenticateMemberService().execute({
      email: env.ISS_PORTAL_EMAIL,
      password: env.ISS_PORTAL_PASSWORD,
    })

    const getTicketsService = new GetTicketsService(apiAuthenticated)

    const fetchTicketInfoService = new FetchTicketInfoService(apiAuthenticated)

    const { response } = await getTicketsService.execute({
      searchField: null,
      searchValue: null,
      perPage: 10,
      page: 1
    })

    const { data } = response.tickets

    const tickets = data.map((tck) => {
      return {
        pkId: tck.id,
        ticketId: tck.tn,
        title: tck.title,
        status: tck.ticket_state_id,
        createdAt: tck.create_time,
        modifiedAt: tck.change_time,
        type: tck.ticket_type,
        priority: tck.ticket_priority_id,
        customerEmail: tck.customer_id,
        curtomerId: tck.cu_id,
        agent: response.agents[tck.user_id],
        agentId: tck.user_id
      }
    })

    // const ticketsInfos = await Promise.all(
    //   tickets.map(async (tck) => {
    //     const r = await fetchTicketInfoService.execute({
    //       ticketId: tck.pkId
    //     })

    //     return r.data
    //   })
    // )

    console.log(tickets)
  } catch (err) {
    console.error(err)
  }
}

main()

// startHttpServer()