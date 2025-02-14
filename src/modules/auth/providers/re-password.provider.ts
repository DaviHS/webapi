import { AuthProvider } from "../auth.provider";
import { firebirdConnect } from "../../../config/db";
import bcrypt from "bcrypt";

export class RePasswordProvider implements AuthProvider {
  async authenticate(userLogin: string, password: string) {
    const db = await firebirdConnect();
    
    try {
      const [info] = await new Promise<any[]>((resolve, reject) => {
        db.query(
          `SELECT I.USUCODIGO, I.USUNOME, I.USULOGIN, I.USUEMAIL, I.USURE, 
          I.USUSENHAHASH, I.USUDATAHORASENHA, I.USUFACIAL, I.USUFOTO
          FROM IAUSUARIO I 
          WHERE I.USUSTATUS = 1 AND I.USURE = ?`,
          [userLogin],
          (err, result) => {
            if (err) reject(err);
            resolve(result);
          }
        );
      });

      if (!info || info.length === 0) {
        return {
          data: null,
          error: true,
          message: "Usuário não encontrado",
        };
      }

      const dataSenha = new Date(info[0].USUDATAHORASENHA).getFullYear();
      password = 'Cal' + dataSenha + '#@!' + password.toUpperCase();

      const validPassword = await bcrypt.compare(password, info[0].USUSENHAHASH);

      if (!validPassword) {
        return {
          data: null,
          error: true,
          message: "Senha inválida",
        };
      }

      // Retornando as informações do usuário se a autenticação for bem-sucedida
      return {
        data: {
          USUCODIGO: info[0].USUCODIGO,
          USUNOME: info[0].USUNOME,
          USULOGIN: info[0].USULOGIN,
          USUEMAIL: info[0].USUEMAIL,
          USURE: info[0].USURE,
          USUFACIAL: info[0].USUFACIAL,
          USUFOTO: info[0].USUFOTO
        },
        error: false,
        message: "Autenticação realizada com sucesso",
      };

    } catch (error) {
      console.error("Erro de autenticação:", error);
      return {
        data: null,
        error: true,
        message: "Erro interno no servidor",
      };
    } finally {
      db.detach();
    }
  }
}