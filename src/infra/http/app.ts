import fastify from "fastify";
import fastifyCors from "@fastify/cors";
import { ticketsRoutes } from "./routes/tickets";
import { ZodError } from "zod";
import env from "../env/config";

const app = fastify()

app.register(fastifyCors, {
  origin: [env.ISS_PORTAL_URL],
  methods: ['GET'],
})

app.register(ticketsRoutes)

app.setErrorHandler((error, request, reply) => {
    if (error instanceof ZodError) {
        return reply.status(400)
                    .send({ message: 'Data validation error!', issues: error.format() })
    }

    console.error(error)
    return reply.status(500).send({ message: 'Internal Server Error' })
})

export default app