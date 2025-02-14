import { FastifyInstance } from "fastify";
import { getProductsHandler, createProductHandler } from "./products.controller";

export default async function productRoutes(fastify: FastifyInstance) {
  fastify.get("", getProductsHandler);
  fastify.post("", createProductHandler);
}
