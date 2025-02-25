import { FastifyReply, FastifyRequest } from "fastify";
import { UserService } from "../service/users.service";

const userService = new UserService();

export const updateUserFacialHandler = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    //const parsedBody = userFacialSchema.parse(req.body);
    const result = await userService.updateUserFacial(req.body);
    reply.send(result);
  } catch (err) {
    reply.status(400).send(err);
  }
};

export const getUserByFacialHandler = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    const result = await userService.getUserByFacial(req.body);
    reply.send(result);
  } catch (err) {
    reply.status(400).send(err);
  }
};