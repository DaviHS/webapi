import { WorkLogsService } from './../service/workLogs.service';
import { FastifyReply, FastifyRequest } from "fastify";

const workLogsService = new WorkLogsService();

export const getWorkLogsHandler = async (req: FastifyRequest, reply: FastifyReply) => {
  try {

    const users = await workLogsService.getWorkLogs(req.query);
    reply.send(users);
  } catch (err) {
    reply.status(500).send(err);
  }
};

export const createWorkLogsHandler = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    const result = await workLogsService.createWorkLog(req.body);
    reply.send(result);
  } catch (err) {
    reply.status(400).send(err);
  }
};