import { AxiosInstance } from "axios"

import { PortalApi } from "./api/portal-api"
import { LoginService } from "./login/login"

import { CookieJar } from "tough-cookie"

interface AuthenticateMemberServiceRequest {
    email: string,
    password: string
}
interface AuthenticateMemberServiceResponse {
    apiAuthenticated: AxiosInstance
}

export class AuthenticateMemberService {
    constructor() { }

    async execute({
        email,
        password
    }: AuthenticateMemberServiceRequest): Promise<AuthenticateMemberServiceResponse> {
        const cookieJar = new CookieJar()

        const apiInstance = await PortalApi.create(cookieJar)

        const loginService = new LoginService(
            apiInstance,
            cookieJar
        )

        const { apiAuthenticated } = await loginService.execute({
            email,
            password,
        })

        return {
            apiAuthenticated,
        }
    }
}