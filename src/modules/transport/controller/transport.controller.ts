import { FastifyRequest, FastifyReply } from "fastify";

export const getTransportInfo = async (request: FastifyRequest, reply: FastifyReply) => {
  return reply.send({ message: "Módulo de Transportes" });
};
