import { FastifyInstance } from "fastify";
import { getTickets } from "../controllers/get-tickets";

export async function ticketsRoutes(app: FastifyInstance) {
    app.post('/tickets', getTickets)
}