import { fastify } from "fastify";
import dotenv from "dotenv";
import { validatorCompiler, serializerCompiler } from "fastify-type-provider-zod";
import fastifyMultipart from '@fastify/multipart';
import { corsPlugin, corsOptions } from "./config/cors";
import { jwtPlugin, jwtOptions } from "./config/jwt";
import { swaggerPlugin, swaggerUiPlugin, swaggerOptions, swaggerSensible } from "./config/swagger";
import { errorHandler } from "./config/errorHandler";
import { registerRoutes } from "./modules/index";

export async function createServer() {
  dotenv.config();

  const app = fastify();

  app.setErrorHandler(errorHandler);

  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);

  app.register(jwtPlugin, jwtOptions);
  app.register(corsPlugin, corsOptions);
  app.register(fastifyMultipart);
  app.register(swaggerSensible);
  app.register(swaggerPlugin, swaggerOptions);
  app.register(swaggerUiPlugin, { routePrefix: '/docs' });

  app.register(registerRoutes, { prefix: "/api" });

  app.get("/", async (request, reply) => {
    return { message: "Hello World!" };
  });

  return app;
}