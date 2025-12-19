import { AxiosInstance } from 'axios'
import { CookieJar } from 'tough-cookie'
import env from '../../../env/config'
import { createApiInstance } from '../api-client'

interface LoginServiceRequest {
  email: string,
  password: string
}

interface LoginServiceResponse {
  api: AxiosInstance
}

export class LoginService {
  constructor(
    private cookieJar: CookieJar = new CookieJar(),
    private logged: boolean = false
  ) { }

  async execute({ email, password }: LoginServiceRequest): Promise<LoginServiceResponse> {
    const api = await createApiInstance(this.cookieJar)

    await api.get('/login')

    const cookies = this.cookieJar.getCookiesSync(env.ISS_PORTAL_URL)
    const xsrfCookie = cookies.find(c => c.key === 'XSRF-TOKEN')

    if (!xsrfCookie) throw new Error('⚠︎ XSRF-TOKEN Cookie not found')

    const credentialsBody = {
      email,
      password,
      remember: false
    }

    const requestConfig = {
      headers: {
        'X-XSRF-TOKEN': decodeURIComponent(xsrfCookie.value)
      }
    }

    await api.post('/login',
      credentialsBody,
      requestConfig
    )

    this.logged = true

    return {
      api
    }
  }
}
