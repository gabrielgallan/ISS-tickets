import { AuthenticateMemberService } from './core/iss-partner/services/authenticate/authenticate'
import { FetchTicketInfoService } from './core/iss-partner/services/fetch-ticket-info/fetch-ticket-info'
import { GetTicketsService } from './core/iss-partner/services/get-tickets/get-tickets'

import env from './infra/env/config'
import { startHttpServer } from './infra/http/server'

async function main() {
  try {
    const authenticateMemberService = new AuthenticateMemberService()

    const { apiAuthenticated } = await authenticateMemberService.execute({
      email: env.ISS_PORTAL_EMAIL,
      password: env.ISS_PORTAL_PASSWORD,
    })

  } catch (err) {
    console.error(err)
  }
}

// main()

startHttpServer()