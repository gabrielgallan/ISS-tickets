import { FastifyInstance } from "fastify";
import { getTickets } from "../controllers/get-tickets";
import { verifySession } from "../middlewares/verify-session";

export async function ticketsRoutes(app: FastifyInstance) {
    app.addHook('onRequest', verifySession)

    app.get('/tickets', getTickets)
}