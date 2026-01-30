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
import { error } from "node:console";
import { logger } from "../logger";
import fastifyJwt from "@fastify/jwt";
import { serverRoutes } from "./router/server";

const app = fastify()

// -> Fastify Plugins
app.register(async () => {
  await app.register(fastifyCors, {
    origin: true,
    credentials: true,
  })

  await app.register(fastifyCookie)

  await app.register(fastifyJwt, {
    secret: env.JWT_SECRET,
    cookie: {
      cookieName: 'refreshToken',
      signed: false
    }
  })
})

// => API Routes

//  -> Frontend 
// app.register(fastifyStatic, {
//   root: path.resolve('../frontend/dist'),
//   prefix: "/",
// })

//  -> Backend API 
app.register(async () => {
  app.register(serverRoutes)
  app.register(sessionRoutes)
  app.register(ticketsRoutes)
}, {
  prefix: 'api'
})

// => Not Found Handler
app.setNotFoundHandler((req, reply) => {
  if (req.url.startsWith('/api')) {
    return reply.code(404).send({
      success: false,
      error: {
        code: 'NOT_FOUND',
        message: 'Not Found'
      }
    })
  }

  return reply.sendFile('index.html')
})

// => Internal Error Handler Handler
app.setErrorHandler((error, request, reply) => {
  if (error instanceof ZodError) {
    return reply.status(400)
      .send({
        success: false,
        error: {
          code: 'BAD_REQUEST',
          message: 'Data validation error!',
          issues: error.format()
        }
      })
  }

  logger.error(error)

  return reply.status(500).send({
    success: false,
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Internal Server Error'
    }
  })
})

export default app