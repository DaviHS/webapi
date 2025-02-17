import { firebirdConnect } from "../../config/db";
import { userSchema } from "./users.schema";
import Firebird  from "node-firebird"

export class UserService {
  async getAllUsers() {
    const db = await firebirdConnect();
    return new Promise((resolve, reject) => {
      db.query("SELECT FIRST 100 * FROM IAUSUARIO", [], (err, result) => {
        db.detach();
        if (err) reject(err);
        resolve(result || []);
      });
    });
  }
  
  async createUser(data: any) {
    const user = userSchema.parse(data);
    const db = await firebirdConnect();
    return new Promise((resolve, reject) => {
      db.query("INSERT INTO USERS (NAME, EMAIL) VALUES (?, ?)", [user.name, user.email], (err) => {
        db.detach();
        if (err) reject(err);
        resolve({ message: "Usuário criado com sucesso!" });
      });
    });
  }

  async updateUserFacial(data: any) {
    const user = userSchema.parse(data); 
    const db = await firebirdConnect();
  
    try {
      const transaction = await new Promise<Firebird.Transaction>((resolve, reject) => {
        db.transaction(Firebird.ISOLATION_READ_COMMITTED, (err, trans) => {
          if (err) reject(err);
          resolve(trans);
        });
      });
  
      await new Promise<void>((resolve, reject) => {
        transaction.query(`UPDATE IAUSUARIO SET USUFACIAL = ?, USUFOTO = ? WHERE USUCODIGO = ?`, 
          [user.facial, user.photo, user.id], 
          (err) => {
            if (err) {
              transaction.rollback(() => db.detach());
              return reject(new Error("Erro ao atualizar os dados faciais do usuário."));
            }
            resolve();
          }
        );
      });
  
      await new Promise<void>((resolve, reject) => {
        transaction.commit((err) => {
          if (err) {
            transaction.rollback(() => db.detach());
            return reject(new Error("Erro ao confirmar a transação."));
          }
          resolve();
        });
      });
  
      return {
        data: new Date(),
        error: false,
        message: "Facial e foto cadastrados com sucesso!",
      };
    } catch (err) {
      console.error("🔴 Erro no cadastro facial:", err);
      return {
        data: new Date(),
        error: true,
        message: "Erro ao registrar a facial do usuário.",
      };
    } finally {
      db.detach();
    }
  }
  
}

