import { LoginService } from './core/iss-partner/services/login'
import { GetTicketsService } from './core/iss-partner/services/get-tickets'
import { GetTicketInfoService } from './core/iss-partner/services/get-ticket-info'

import env from './env/config'

async function request() {
  try {
    const { api } = await new LoginService().execute({ 
      email: env.ISS_PORTAL_EMAIL,
      password: env.ISS_PORTAL_PASSWORD
    })

    const data = await new GetTicketsService(api).execute({
      searchField: 'tn',
      searchValue: '2025121610000004',
      perPage: 10,
      page: 2
    })

    console.log(data.data.tickets.data)
  } catch (err) {
    console.error(err)
  }
}

request()