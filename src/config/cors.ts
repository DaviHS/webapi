import { fastifyCors } from "@fastify/cors";

export const corsOptions = {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  exposedHeaders: ["X-Custom-Header"],
  credentials: true,
};

export const corsPlugin = fastifyCors;