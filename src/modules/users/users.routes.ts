import { FastifyInstance } from "fastify";
import { getUsersHandler, createUserHandler, updateUserFacialHandler } from "./users.controller";

export default async function userRoutes(fastify: FastifyInstance) {
  fastify.get("", getUsersHandler);
  fastify.post("", createUserHandler);
  fastify.put("/register-facial", updateUserFacialHandler);
}
