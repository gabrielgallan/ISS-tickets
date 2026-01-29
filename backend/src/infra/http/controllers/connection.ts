import { FastifyReply, FastifyRequest } from "fastify";

export async function health(
    request: FastifyRequest, 
    reply: FastifyReply
) {
    return reply.status(200).send({
        success: true,
        data: {}
    })
}