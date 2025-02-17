import { FastifyReply, FastifyRequest } from "fastify";
import { UserService } from "./users.service";
import { userFacialSchema } from "./users.schema";

const userService = new UserService();

export const getUsersHandler = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    const users = await userService.getAllUsers();
    reply.send(users);
  } catch (err) {
    reply.status(500).send(err);
  }
};

export const createUserHandler = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    const result = await userService.createUser(req.body);
    reply.send(result);
  } catch (err) {
    reply.status(400).send(err);
  }
};

export const updateUserFacialHandler = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    const parsedBody = userFacialSchema.parse(req.body);
    const result = await userService.updateUserFacial(parsedBody);
    reply.send(result);
  } catch (err) {
    reply.status(400).send(err);
  }
};