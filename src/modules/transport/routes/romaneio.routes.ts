import { FastifyInstance } from "fastify";
import { getRomaneios, createRomaneio } from "../controller/romaneio.controller";

export default async function romaneioRoutes(fastify: FastifyInstance) {
  fastify.get("", getRomaneios);  // Agora a rota será /transport/romaneio
  fastify.post("", createRomaneio);
}
