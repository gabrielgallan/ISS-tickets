import { AxiosInstance } from "axios"

import { InitSessionService } from "./dependences/init-session"
import { IssPartnerApi } from "./dependences/iss-partner-api"
import { LoginService } from "./dependences/login"

import env from "@/infra/env/config"
import { CookieJar } from "tough-cookie"

interface AuthenticateMemberServiceRequest {
    email: string,
    password: string
}
interface AuthenticateMemberServiceResponse {
    apiAuthenticated: AxiosInstance
}

export class AuthenticateMemberService {
    constructor(
        private cookiesManager: CookieJar = new CookieJar()
    ) { }

    async execute({
        email,
        password
    }: AuthenticateMemberServiceRequest): Promise<AuthenticateMemberServiceResponse> 
    {
        const apiInstance = await new IssPartnerApi(this.cookiesManager).create()
        const sessionService = new InitSessionService(this.cookiesManager, apiInstance)

        const { apiWithSession, sessionCookie } = await sessionService.execute({})

        const loginService = new LoginService(apiWithSession)

        const { apiAuthenticated } = await loginService.execute({
            email,
            password,
            sessionCookie,
        })

        return {
            apiAuthenticated,
        }
    }
}