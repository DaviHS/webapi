import { FastifyInstance } from "fastify";
import { getTransfers, createTransfer } from "../controller/transfer.controller";

export default async function transferRoutes(fastify: FastifyInstance) {
  fastify.get("", getTransfers);   // Agora a rota será /transport/transfer
  fastify.post("", createTransfer);
}
