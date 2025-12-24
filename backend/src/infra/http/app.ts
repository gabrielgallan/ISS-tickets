import fastify from "fastify";
import fastifyCors from "@fastify/cors";
import fastifyStatic from "@fastify/static";
import fastifyCookie from "@fastify/cookie";
import { ticketsRoutes } from "./router/tickets";
import { sessionRoutes } from "./router/session";
import { ZodError } from "zod";
import env from "../env/config";
import { fileURLToPath } from "node:url";
import path from "node:path";

const app = fastify()

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.register(fastifyCors, {
  origin: [
    `http://127.0.0.1:${env.PORT}`,
    `http://localhost:${env.PORT}`,
    'http://127.0.0.1:5173',
    'http://localhost:5173',
  ],
  methods: ['GET', 'POST'],
  credentials: true
})

app.register(fastifyStatic, {
  root: path.join(__dirname, "../../frontend/dist"),
  prefix: "/",
})

app.register(fastifyCookie)

app.setNotFoundHandler((req, reply) => {
  if (req.url.startsWith('/api')) {
    return reply.code(404).send({ message: 'Not Found' })
  }

  return reply.sendFile('index.html')
})

app.register(ticketsRoutes, {
  prefix: 'api'
})

app.register(sessionRoutes, {
  prefix: 'api'
})

app.setErrorHandler((error, request, reply) => {
    if (error instanceof ZodError) {
        return reply.status(400)
                    .send({ message: 'Data validation error!', issues: error.format() })
    }

    console.error(error)
    return reply.status(500).send({ message: 'Internal Server Error' })
})

export default app