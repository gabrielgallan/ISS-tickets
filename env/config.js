import 'dotenv/config'
import z from 'zod'

const envSchema = z.object({
    PORT: z.coerce.number().default(3000),
    ISS_PORTAL_EMAIL: z.string().email(),
    ISS_PORTAL_PASSWORD: z.string()
})

const _env = envSchema.safeParse(process.env)

if (_env.success === false) {
    const errors = _env.error.format()
    console.error('Invalid enviroment variable!', errors)

    process.exit(1)
}

const env = _env.data

export default env