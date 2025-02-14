import { FastifyRequest, FastifyReply } from "fastify";
import { getRomaneiosService, createRomaneioService } from "../service/romaneio.service";

export const getRomaneios = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const romaneios = await getRomaneiosService();
    return reply.send(romaneios);
  } catch (error) {
    return reply.status(500).send({ error: "Erro ao buscar romaneios" });
  }
};

export const createRomaneio = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const result = await createRomaneioService(request.body);
    return reply.status(201).send(result);
  } catch (error) {
    return reply.status(400).send(error);
  }
};
