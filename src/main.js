import { LoginService } from './core/iss-partner/services/login.js'
import { GetTicketsService } from './core/iss-partner/services/get-tickets.js'
import { GetTicketInfoService } from './core/iss-partner/services/get-ticket-info.js'
import env from './env/config.js'

async function request() {
  try {
    const { api } = await new LoginService(env.ISS_PORTAL_EMAIL, env.ISS_PORTAL_PASSWORD).execute()

    const data = await new GetTicketsService(api).execute()

    console.log(data)
  } catch (err) {
    console.error(err)
  }
}

request()