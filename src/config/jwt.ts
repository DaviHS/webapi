import { fastifyJwt } from "@fastify/jwt";
import dotenv from "dotenv";

dotenv.config();

export const jwtPlugin = fastifyJwt;
export const jwtOptions = {
  secret: process.env.JWT_SECRET || "supersecret",
};