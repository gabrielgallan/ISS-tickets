import axios from 'axios'
import { CookieJar } from 'tough-cookie'
import { wrapper } from 'axios-cookiejar-support'
import env from '../../../env/config.js'

export class LoginService {
  constructor(email, password) {
    this.jar = new CookieJar()

    this.credentials = { 
      email, 
      password, 
      remember: false
    }
    this.api = wrapper(
      axios.create({
        baseURL: env.ISS_PORTAL_URL,
        withCredentials: true,
        jar: this.jar
      })
    )
    this.logged = false
  }

  async execute() {
    await this.api.get('/login')

    const cookies = this.jar.getCookiesSync(env.ISS_PORTAL_URL)

    const xsrfCookie = cookies.find(c => c.key === 'XSRF-TOKEN')

    if (!xsrfCookie) throw new Error('⚠︎ XSRF-TOKEN Cookie not found')
    
    const xsrf = decodeURIComponent(xsrfCookie.value)

    await this.api.post('/login',
      this.credentials,
      {
        headers: {
          'X-XSRF-TOKEN': xsrf,
        }
      }
    )

    this.logged = true

    return {
      api: this.api
    }
  }
}
