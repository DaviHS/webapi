import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { RePasswordProvider } from "./providers/re-password.provider";
import { loginSchema, LoginInput } from "./auth.schemas";

export default async function authRoutes(fastify: FastifyInstance) {
  fastify.post(
    "/login",
    async (request: FastifyRequest<{ Body: LoginInput }>, reply: FastifyReply) => {
      try {
        const body = loginSchema.parse(request.body);
  
        let provider;
  
        if (body.auth_type === "re_password") {
          provider = new RePasswordProvider();
        } else {
          return reply.status(400).send({
            data: null,
            error: true,
            message: "Tipo de autenticação inválido!",
          });
        }
  
        if (!provider) {
          return reply.status(500).send({
            data: null,
            error: true,
            message: "Erro interno: Nenhum provedor de autenticação disponível!",
          });
        }
  
        const result = await provider.authenticate(body.userLogin, body.password);
  
        if (result.error) {
          return reply.status(400).send(result);
        }
  
        const token = fastify.jwt.sign({ id: result.data?.USUCODIGO, name: result.data?.USUNOME });
  
        return reply.send({
          data: { ...result.data, token },
          error: false,
          message: "Login realizado com sucesso",
        });
  
      } catch (err) {
        console.error("Erro durante a autenticação:", err);
        return reply.status(500).send({
          data: null,
          error: true,
          message: "Erro interno no servidor",
        });
      }
    }
  );
}  