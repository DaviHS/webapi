import { FastifyRequest, FastifyReply } from "fastify";
import { getTransfersService, createTransferService } from "../service/transfer.service";

export const getTransfers = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const transfers = await getTransfersService();
    return reply.send(transfers);
  } catch (error) {
    return reply.status(500).send({ error: "Erro ao buscar transferências" });
  }
};

export const createTransfer = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const result = await createTransferService(request.body);
    return reply.status(201).send(result);
  } catch (error) {
    return reply.status(400).send(error);
  }
};
