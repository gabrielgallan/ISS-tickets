import env from "@/infra/env/config";
import axios from "axios";
import { wrapper } from "axios-cookiejar-support";
import { CookieJar } from "tough-cookie";

export class PortalApi {
    static async create(cookieJar: CookieJar) {
        return wrapper(
            axios.create({
                baseURL: env.ISS_PORTAL_URL,
                withCredentials: true,
                jar: cookieJar
            })
        )
    }
}