import { AuthProvider } from "../auth.provider";
import { firebirdConnect } from "@/config/db";
import bcrypt from "bcrypt";
import { authSchema } from "@/schemas";

export class RePasswordProvider implements AuthProvider {
  async authenticate(data: any) {
    const db = await firebirdConnect();
    const auth = authSchema.parse(data);

    try {
      const user = await new Promise<any>((resolve, reject) => {
        db.query(
          `SELECT I.USUCODIGO, I.USUNOME, I.USULOGIN, I.USUEMAIL, I.USURE, 
          I.USUSENHAHASH, I.USUDATAHORASENHA, CAST(I.USUFACIAL AS VARCHAR(5000)) AS USUFACIAL
          FROM IAUSUARIO I 
          WHERE I.USUSTATUS = 1 AND I.USURE = ?`,
          [auth.userLogin],
          (err, result) => {
            if (err) {
              db.detach();
              return reject(err);
            }
            resolve(result[0]);
          }
        );
      });

      if (!user) {
        return { data: null, error: true, message: "Usuário não encontrado" };
      }

      const dataSenha = new Date(user.USUDATAHORASENHA).getFullYear();
      auth.password = `Cal${dataSenha}#@!${auth.password!.toUpperCase()}`;

      const validPassword = await bcrypt.compare(auth.password, user.USUSENHAHASH);

      if (!validPassword) {
        return { data: null, error: true, message: "Senha inválida" };
      }

      return {
        data: {
          USUCODIGO: user.USUCODIGO,
          USUNOME: user.USUNOME,
          USULOGIN: user.USULOGIN,
          USUEMAIL: user.USUEMAIL,
          USURE: user.USURE,
          USUFACIAL: user.USUFACIAL,
        },
        error: false,
        message: "Autenticação realizada com sucesso",
      };
    } catch (error) {
      console.error("Erro de autenticação:", error);
      return { data: null, error: true, message: "Erro interno no servidor" };
    } finally {
      if (db) db.detach();
    }
  }
}