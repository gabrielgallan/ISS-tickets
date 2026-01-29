import { FastifyInstance } from "fastify";
import { authenticate } from "../controllers/authenticate";
import { refresh } from "@/infra/http/controllers/refresh";

export async function sessionRoutes(app: FastifyInstance) {
    app.post('/session', authenticate)
    // app.patch('/session', authenticate)
    // app.patch('/session/refresh', refresh)
}