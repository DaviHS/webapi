import { firebirdConnect } from "@/config/db";
import { userSchema } from "@/schemas";
import Firebird  from "node-firebird";
import { calculateEuclideanDistance, createResponse } from "@/lib/utils";

export class UserService {
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

      let photoBuffer: Buffer | null = null;
      if (user.photo) {
        const base64Data = user.photo.split(",")[1]; // Removendo o prefixo 'data:image/png;base64,'
        photoBuffer = Buffer.from(base64Data, "base64");
      }

      const embeddingJson = JSON.stringify(user.facial); 
  
      await new Promise<void>((resolve, reject) => {
        transaction.query(`UPDATE IAUSUARIO SET USUFACIAL = ?, USUFOTO = ? WHERE USUCODIGO = ?`, 
          [embeddingJson, photoBuffer, user.id], 
          (err) => {
            if (err) {
              transaction.rollback(() => db.detach());
              return reject(createResponse(true, "Erro ao atualizar os dados faciais do usuário.", err));
            }
            resolve();
          }
        );
      });
  
      await new Promise<void>((resolve, reject) => {
        transaction.commit((err) => {
          if (err) {
            transaction.rollback(() => db.detach());
            return reject(createResponse(true, "Erro ao confirmar a transação.", err));
          }
          resolve();
        });
      });
  
      return createResponse(false, "Facial e foto cadastrados com sucesso!", new Date());
    } catch (err) {
      console.error("🔴 Erro no cadastro facial:", err);
      return createResponse(true, "Erro ao registrar a facial do usuário.", err);
    } finally {
      db.detach();
    }
  }

  async getUserByFacial(data: any){
    
    const user = userSchema.parse(data);
    const db = await firebirdConnect();
    const detectedEmbedding = user.facial;
    
    return new Promise((resolve, reject) => {
      db.query(
         `SELECT USUCODIGO, USURE, USUNOME, USUEMAIL, USUFOTO, 
            CAST(USUFACIAL AS VARCHAR(5000)) AS USUFACIAL 
          FROM IAUSUARIO 
          WHERE USUSTATUS = 1 AND USUFACIAL IS NOT NULL`,
        [],
        (err, result) => {
          db.detach();
          if (err) {
            return reject(createResponse(true, "Erro ao buscar usuários para comparação.", err));
          }
        
          if (!result || result.length === 0) {
            return resolve(createResponse(true, "Nenhum usuário encontrado para comparação."));
          }
        
          let bestMatch: any = null;
          let minDistance = Infinity;
        
          result.forEach((row: any) => {
            try {
              if (!row.USUFACIAL || typeof row.USUFACIAL !== "string") {
                console.warn(`⚠️ Dados inválidos para usuário ${row.USURE}. Pulando...`);
                return;
              }
        
              const sanitizedEmbedding = row.USUFACIAL.trim();
              if (!sanitizedEmbedding.startsWith("[") || !sanitizedEmbedding.endsWith("]")) {
                console.warn(`⚠️ Formato inválido para usuário ${row.USURE}. Pulando...`);
                return;
              }
        
              const storedEmbedding = JSON.parse(sanitizedEmbedding);
        
              if (!Array.isArray(storedEmbedding) || storedEmbedding.length !== detectedEmbedding!.length) {
                console.warn(`⚠️ Embedding inválido para usuário ${row.USURE}. Pulando...`);
                return;
              }
        
              const distance = calculateEuclideanDistance(detectedEmbedding!, storedEmbedding);
              console.log(`📏 Distância para usuário ${row.USURE}: ${distance}`);
        
              if (distance < minDistance) {
                minDistance = distance;
                bestMatch = row;
              }
              
            } catch (parseError) {
              console.error(`❌ Erro ao processar embedding do usuário ${row.USURE}:`, parseError);
            }
          });
        
          if (bestMatch) {
            console.log(bestMatch);
            return resolve(createResponse(false, `Usuário ${bestMatch.USURE} - ${bestMatch.USUNOME} mais próximo!`, bestMatch));
          } else {
            return resolve(createResponse(true, "Nenhum usuário compatível encontrado."));
          }
        }
      );
    });
  }
  
}