import env from '@/infra/env/config'
import { AxiosError, AxiosInstance } from 'axios'
import { CookieJar } from 'tough-cookie'
import { CookiesNotFoundError } from '../../errors/cookies-not-found'
import { InvalidCredentialsError } from '../../errors/invalid-credentials'
import { InvalidPortalUrlError } from '../../errors/invalid-portal-url'
import { InternalServerError } from '../../errors/internal-server-error'

interface LoginServiceRequest {
  email: string,
  password: string,
}

interface LoginServiceResponse {
  apiAuthenticated: AxiosInstance
}

export class LoginService {
  constructor(
    private apiInstance: AxiosInstance,
    private apiCookieJar: CookieJar
  ) { }

  async execute({
    email,
    password,
  }: LoginServiceRequest): Promise<LoginServiceResponse> {
    let apiAuthenticated

    try {
      await this.apiInstance.get('/login')

      const cookies = await this.apiCookieJar.getCookies(env.ISS_PORTAL_URL)

      const xsrfCookie = cookies.find(c => c.key === 'XSRF-TOKEN')

      if (!xsrfCookie) throw new CookiesNotFoundError()

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

      const loginResponse = await this.apiInstance.post('/login',
        credentialsBody,
        requestConfig
      )

      apiAuthenticated = this.apiInstance

      return {
        apiAuthenticated,
      }
    } catch (err: any) {
      if (err instanceof AxiosError) {
        if (err.response) {
          if (err.response.status === 422) throw new InvalidCredentialsError()
        }

        if (err.code == 'ENOTFOUND') throw new InvalidPortalUrlError()
      }

      throw new InternalServerError(err.message)
    }
  }
}
