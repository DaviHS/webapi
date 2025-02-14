import { FastifyInstance } from "fastify";
import authRoutes from "./auth/auth.routes";
import userRoutes from "./users/users.routes";
import productRoutes from "./products/products.routes";
import transportRoutes from "./transport/routes/transport.routes";

export async function registerRoutes(app: FastifyInstance) {
  
  app.register(authRoutes, { prefix: "/auth" });
  app.register(userRoutes, { prefix: "/users" });
  app.register(productRoutes, { prefix: "/products" });
  app.register(transportRoutes, { prefix: "/transport" });
}