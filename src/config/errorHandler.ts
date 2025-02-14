import { FastifyError, FastifyReply, FastifyRequest } from "fastify";

export function errorHandler(error: FastifyError, request: FastifyRequest, reply: FastifyReply) {
  const statusCode = error.statusCode ?? 500;

  const response = {
    error: true,
    message: error.message || "Erro interno no servidor",
    code: error.code || "INTERNAL_ERROR", 
  };

  if (statusCode >= 500) {
    console.error("Erro interno:", error);
  }

  reply.status(statusCode).send(response);
}