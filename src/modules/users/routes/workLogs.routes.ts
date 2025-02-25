import { workLogsSchema, queryWorkLogSchema } from "@/schemas/index"
import { FastifyInstance } from "fastify";
import { 
  getWorkLogsHandler, 
  createWorkLogsHandler   
} from "../controller/workLogs.controller";

export default async function workLogsRoutes(fastify: FastifyInstance) {
  fastify.get("", { 
    schema: {
      querystring: queryWorkLogSchema
    },
  }, getWorkLogsHandler);

  fastify.post("", {
    schema: {
      body: workLogsSchema.pick({
        re: true,
        name: true,
        status: true,
        datahora: true
      }), 
      200: {
        type: "object",
        properties: {
          error: { type: "boolean", example: false },
          message: { type: "string", example: "Ponto cadastrado com Sucesso" },
          data: { 
            type: "string", 
            example: "2025-02-17T15:30:00Z" 
          },
        },
      },
    },
  }, createWorkLogsHandler);

}