import { FastifyInstance } from "fastify";
import {
  updateUserFacialHandler,
  getUserByFacialHandler } from "../controller/users.controller";
import { userSchema } from "@/schemas"
import workLogsRoutes from "./workLogs.routes";

export default async function userRoutes(fastify: FastifyInstance) {
  fastify.patch("/updateFacial", {
    schema: {
      body: userSchema.pick({
        id: true,
        facial: true, 
        photo: true,
      }), 
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

  fastify.post("/findByFacial", { 
    
    schema: {
      body: userSchema.pick({
        facial: true,
      }), 
      200: {
        type: "object",
        properties: {
          error: { type: "boolean", example: false },
          message: { type: "string", example: "Localizado Usuário compatível!" },
          data: { 
            type: "string", 
            example: "Usuário X encontrado" 
          },
        },
      },
    },
  }, getUserByFacialHandler);

  fastify.register(workLogsRoutes, { prefix: "/work-logs" });

}