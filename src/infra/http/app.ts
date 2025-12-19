import fastify from "fastify";
import { ticketsRoutes } from "./router/tickets";

const app = fastify()

app.register(ticketsRoutes)

export default app