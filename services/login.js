import axios from "axios"
import { CookieJar } from "tough-cookie"
import { wrapper } from "axios-cookiejar-support"

const baseURL = "https://partner.issivs.com"

// Cookie jar (como o navegador)
const jar = new CookieJar()

// Axios com suporte a cookies
const api = wrapper(
  axios.create({
    baseURL,
    withCredentials: true,
    jar
  })
)

export async function login(email, password) {
  // 1️⃣ GET /login → gera cookies + XSRF
  await api.get("/login")

  // pega XSRF do cookie
  const cookies = jar.getCookiesSync(baseURL)
  const xsrfCookie = cookies.find(c => c.key === "XSRF-TOKEN")

  if (!xsrfCookie) throw new Error("❌ Não foi possível encontrar XSRF-TOKEN")

  const xsrf = decodeURIComponent(xsrfCookie.value)

  // 2️⃣ POST /login
  const response = await api.post(
    "/login",
    {
      email,
      password,
      remember: false
    },
    {
      headers: {
        "Content-Type": "application/json",
        "X-XSRF-TOKEN": xsrf,
        "X-Requested-With": "XMLHttpRequest"
      }
    }
  )

  // retorna exatamente a resposta do servidor
  return {
        data: response.data,
        api
    }
}
