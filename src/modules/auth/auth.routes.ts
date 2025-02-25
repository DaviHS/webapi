import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { RePasswordProvider } from "./providers/re-password.provider";
import { FacialAuthProvider } from "./providers/facial-provider";
import { authSchema, AuthInput } from "@/schemas";

export default async function authRoutes(fastify: FastifyInstance) {
  fastify.post(
    "/login",
    async (request: FastifyRequest<{ Body: AuthInput }>, reply: FastifyReply) => {
      try {
        const body = authSchema.parse(request.body);

        let provider;

        if (body.auth_type === "re_password") {
          provider = new RePasswordProvider();
        } else if(body.auth_type === "facial_auth") {
          provider = new FacialAuthProvider();    
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

        const result = await provider.authenticate(body);

        if (result.error) {
          return reply.send({
            data: { ...result.data },
            error: true,
            message: result.message ,
          });
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
