// import env from "@/infra/env/config"
// import { CookieJar } from "tough-cookie"

// import { AuthenticateMemberService } from "@/core/iss-partner/services/authenticate/authenticate"
// import { GetTicketsService } from "@/core/iss-partner/services/get-tickets/get-tickets"
// import { readFile } from "node:fs/promises"
// import { PortalApi } from "@/core/iss-partner/services/authenticate/api/portal-api"

// export async function allProccess() {
//     const jar = new CookieJar()
//     const authenticateMemberService = new AuthenticateMemberService(jar)

//     const { apiAuthenticated } = await authenticateMemberService.execute({
//         email: env.ISS_PORTAL_EMAIL,
//         password: env.ISS_PORTAL_PASSWORD,
//     })

//     const { tickets } = await new GetTicketsService(apiAuthenticated).execute({
//         searchField: 'tn',
//         searchValue: '',
//         filters: {
//             ticketStateIds: [],
//             ticketPriorityIds: [],
//             ticketTypeIds: []
//         },
//         perPage: 10,
//         page: 1
//     })
// }

// export async function authenticateSaveJar() {
//     import { cookieJarSession } from '../infra/cookies/cookies'
// }

// export async function savingJar() {
//     const raw = await readFile('iss-session.json', 'utf8')
//     const json = JSON.parse(raw)

//     const jar = await CookieJar.deserialize(json)

//     const apiAuthenticated = await PortalApi.create(jar)

//     const { tickets } = await new GetTicketsService(apiAuthenticated).execute({
//         searchField: 'tn',
//         searchValue: '',
//         filters: {
//             ticketStateIds: [],
//             ticketPriorityIds: [],
//             ticketTypeIds: []
//         },
//         perPage: 10,
//         page: 1
//     })
// }