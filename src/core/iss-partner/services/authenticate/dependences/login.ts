import { AxiosInstance } from 'axios'
import { Cookie } from 'tough-cookie'

interface LoginServiceRequest {
  email: string,
  password: string,
  sessionCookie: Cookie
}

interface LoginServiceResponse {
  apiAuthenticated: AxiosInstance
}

export class LoginService {
  constructor(
    private apiWithSession: AxiosInstance
  ) { }

  async execute({ 
    email,
    password,
    sessionCookie
  }: LoginServiceRequest): Promise<LoginServiceResponse> {
    const credentialsBody = {
      email,
      password,
      remember: false
    }

    const requestConfig = {
      headers: {
        'X-XSRF-TOKEN': decodeURIComponent(sessionCookie.value)
      }
    }

    await this.apiWithSession.post('/login',
      credentialsBody,
      requestConfig
    )

    const apiAuthenticated = this.apiWithSession

    return {
      apiAuthenticated,
    }
  }
}
