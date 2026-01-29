import { FastifyInstance } from "fastify";
import { getTickets } from "../controllers/get-tickets";
import { verifyJWT } from "../middlewares/verify-jwt";

export async function ticketsRoutes(app: FastifyInstance) {
    app.addHook('onRequest', verifyJWT)

    app.get('/tickets', getTickets)
}