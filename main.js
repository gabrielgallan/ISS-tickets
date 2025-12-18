import { login } from "./services/login.js"
import env from './env/config.js'

async function request(url) {
  try {
    const { data, api } = await login(env.ISS_PORTAL_EMAIL, env.ISS_PORTAL_PASSWORD)

    const response = await api.get(url)

    console.log(response.data)
  } catch (err) {
    console.error(err)
  }
}

// request("https://partner.issivs.com/api/ticket/14897/messages")