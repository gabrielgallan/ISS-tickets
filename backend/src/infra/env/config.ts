import 'dotenv/config'
import z from 'zod'

const envSchema = z.object({
    PORT: z.coerce.number().default(3000),
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
    ISS_PORTAL_URL: z.string().url()
        .refine((value) => value.startsWith('https://'), {
            message: 'ISS_PORTAL_URL deve usar HTTPS'
        }),
    CRYPTO_KEY: z.string(),
    JWT_SECRET: z.string(),
    REDIS_URL: z.string().url()
})

const _env = envSchema.safeParse(process.env)

if (_env.success === false) {
    const errors = _env.error.format()
    console.error('Invalid enviroment variable!', errors)

    process.exit(1)
}

const env = _env.data

export default env