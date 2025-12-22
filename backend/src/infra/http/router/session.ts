import { FastifyInstance } from "fastify";
import { authenticate } from "../controllers/authenticate";
import { refresh } from "@/infra/http/controllers/refresh";
import { verifySession } from "../middlewares/verify-session";

export async function sessionRoutes(app: FastifyInstance) {
    app.post('/session', authenticate)
    app.get('/session/refresh', { onRequest: [verifySession] }, refresh)
}