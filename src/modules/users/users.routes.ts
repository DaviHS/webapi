import { FastifyInstance } from "fastify";
import { getUsersHandler, createUserHandler, updateUserFacialHandler } from "./users.controller";
import { userSchema, userFacialSchema } from "./users.schema";
import z from "zod";

export default async function userRoutes(fastify: FastifyInstance) {
  fastify.get("", getUsersHandler);
  fastify.post("", createUserHandler);

  fastify.patch("/register-facial", {
    schema: {
      body: userFacialSchema, 
      200: {
        type: "object",
        properties: {
          error: { type: "boolean", example: false },
          message: { type: "string", example: "Facial e foto cadastrados com sucesso!" },
          data: { 
            type: "string", 
            example: "2025-02-17T15:30:00Z" 
          },
        },
      },
    },
  }, updateUserFacialHandler);
}