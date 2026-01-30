import '@fastify/jwt'

declare module '@fastify/jwt' {
  interface FastifyJWT {
    payload: {
      key: string
    }
    user: {
      key: string
    }
  }
}
