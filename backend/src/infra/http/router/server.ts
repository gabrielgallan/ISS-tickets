import { FastifyInstance } from "fastify";
import { connection } from "../controllers/connection";

export async function serverRoutes(app: FastifyInstance) {
    app.get('/connection', connection)
}