import { FastifyInstance } from "fastify";
import romaneioRoutes from "./romaneio.routes";
import transferRoutes from "./transfer.routes";

export default async function transportRoutes(fastify: FastifyInstance) {
  fastify.register(romaneioRoutes, { prefix: "/romaneio" });
  fastify.register(transferRoutes, { prefix: "/transfer" });

  fastify.get("/transport", async (request, reply) => {
    return reply.send({ message: "API de Transporte funcionando!" });
  });
}
