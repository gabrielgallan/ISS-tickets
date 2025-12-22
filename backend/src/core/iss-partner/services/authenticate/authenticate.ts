import { AxiosInstance } from "axios"

import { PortalApi } from "./api/portal-api"
import { LoginService } from "./login/login"

import { CookieJar } from "tough-cookie"

interface AuthenticateMemberServiceRequest {
    email: string,
    password: string
}
interface AuthenticateMemberServiceResponse {
    apiAuthenticated: AxiosInstance,
    cookieJar: CookieJar
}

export class AuthenticateMemberService {
    constructor(
        private cookieJar: CookieJar
    ) { }

    async execute({
        email,
        password
    }: AuthenticateMemberServiceRequest): Promise<AuthenticateMemberServiceResponse> {
        const apiInstance = await PortalApi.create(this.cookieJar)

        const loginService = new LoginService(
            apiInstance,
            this.cookieJar
        )

        const { apiAuthenticated } = await loginService.execute({
            email,
            password,
        })

        return {
            apiAuthenticated,
            cookieJar: this.cookieJar
        }
    }
}