import 'dotenv/config'
import z from 'zod'

const envSchema = z.object({
    ISS_PORTAL_EMAIL: z.string(),
    ISS_PORTAL_PASSWORD: z.string(),
    ISS_PORTAL_URL: z.string()
})

const _env = envSchema.safeParse(process.env)

if (_env.success === false) {
    const errors = _env.error.format()
    console.error('Invalid enviroment variable!', errors)

    process.exit(1)
}

const env = _env.data

export default env