import { CookieJar } from "tough-cookie"
import { writeFile, readFile } from "fs/promises"

const COOKIE_FILE = "iss-session.json"

export const CookieStorage = {
  async save(jar: CookieJar) {
    const serialized = await jar.serialize()
    await writeFile(COOKIE_FILE, JSON.stringify(serialized, null, 2))
  },

  async load(): Promise<CookieJar | null> {
    try {
      const file = await readFile(COOKIE_FILE, "utf8")
      const parsed = JSON.parse(file)

      const jar = await CookieJar.deserialize(parsed)

      return jar
    } catch {
      return null
    }
  }
}