import env from "@/infra/env/config";
import axios from "axios";
import { wrapper } from "axios-cookiejar-support";
import { CookieJar } from "tough-cookie";

export class IssPartnerApi {
    constructor(
        private cookieJar: CookieJar
    ) {}

    async create() {
        return wrapper(
            axios.create({
                baseURL: env.ISS_PORTAL_URL,
                withCredentials: true,
                jar: this.cookieJar
            })
        )
    }
}