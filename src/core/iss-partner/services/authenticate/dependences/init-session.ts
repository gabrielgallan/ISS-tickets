import { CookieJar } from "tough-cookie";
import { AxiosInstance } from "axios";

import env from "@/infra/env/config";

interface InitSessionServiceRequest {
}

interface InitSessionServiceResponse {
    apiWithSession: AxiosInstance,
    sessionCookie: any
}

export class InitSessionService {
    constructor(
        private cookiesManager: CookieJar,
        private apiInstance: AxiosInstance
    ) {}

    async execute({}: InitSessionServiceRequest): Promise<InitSessionServiceResponse> 
    {
        await this.apiInstance.get('/login')

        const cookies = this.cookiesManager.getCookiesSync(env.ISS_PORTAL_URL)

        const xsrfCookie = cookies.find(c => c.key === 'XSRF-TOKEN')

        if (!xsrfCookie) throw new Error('⚠︎ XSRF-TOKEN Cookie not found')

        const apiWithSession = this.apiInstance

        return {
            apiWithSession,
            sessionCookie: xsrfCookie
        }
    }
}