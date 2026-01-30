import { CookieJar } from "tough-cookie"
import { startHttpServer } from "./infra/http/server"
import { AuthenticateMemberService } from "./core/iss-partner/services/authenticate/authenticate"
import { logger } from "./infra/logger"
import { PortalApi } from "./core/iss-partner/services/authenticate/api/portal-api"
import { GetTicketsService } from "./core/iss-partner/services/get-tickets/get-tickets"
import { SessionManager } from "./infra/session/session"
import { NodeCryptoEncrypter } from "./infra/encrypter/node-crypto/node-crypto-encrypter"
import { InMemorySessionsRepository } from "./infra/repositories/in-memory/in-memory-sessions-repository"
import { connectRedis } from "./infra/lib/redis"
import { makeSessionManager } from "./infra/session/factories/make-session-manager"
import env from "./infra/env/config"

connectRedis()

logger.info('Node Environment:', env.NODE_ENV)
startHttpServer()

// const sessionManager = makeSessionManager()

// // -> Create
// const session = await sessionManager.createSession()

// const { apiAuthenticated } = await new AuthenticateMemberService(new CookieJar()).execute({
//     email: 'gabriel.gallan@issivs.com',
//     password: 'Gallan@iss'
// })

// const { tickets } = await new GetTicketsService(apiAuthenticated).execute({
//     searchField: 'tn',
//     searchValue: '',
//     filters: {
//         ticketStateIds: [],
//         ticketPriorityIds: [],
//         ticketTypeIds: []
//     },
//     timestamp: {
//         start:  new Date(2025, 11, 1, 9, 30, 0),
//         end:  new Date(2025, 11, 31, 18, 30, 0)
//     },
//     perPage: 1000,
//     page: 1
// })

// logger.info('Tickets:', tickets)