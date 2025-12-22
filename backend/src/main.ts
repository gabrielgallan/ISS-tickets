import { startHttpServer } from "./infra/http/server"
import { AuthenticateMemberService } from "./core/iss-partner/services/authenticate/authenticate";
import env from "./infra/env/config";

async function main() {
    try {
        // const jar = CookiesManager.createJar()
        // const authenticateService = new AuthenticateMemberService(jar)

        // const { apiAuthenticated, cookieJar } = await authenticateService.execute({
        //     email: env.ISS_PORTAL_EMAIL,
        //     password: env.ISS_PORTAL_PASSWORD
        // })

        // const response = await apiAuthenticated.get('/refresh')

        // console.log(cookieJar.serializeSync())
    } catch (err: any) {
        console.error(err)
    }
}

// main()

console.log(env.NODE_ENV)
startHttpServer()