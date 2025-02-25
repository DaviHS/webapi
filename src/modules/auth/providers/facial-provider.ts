import { AuthProvider } from "../auth.provider";
import { firebirdConnect } from "@/config/db"
import { calculateEuclideanDistance, createResponse } from "@/lib/utils";
import { authSchema } from "@/schemas";

export class FacialAuthProvider implements AuthProvider {
  async authenticate(data: any) {
    const auth = authSchema.parse(data); 
    const db = await firebirdConnect();
    const detectedEmbedding = auth.facial; 

    try {
      if (!detectedEmbedding || detectedEmbedding.length === 0) {
        return {
          data: null,
          error: true,
          message: "Dado facial não fornecido ou inválido.",
        };
      }

      const users = await new Promise<any[]>((resolve, reject) => {
        db.query(
          `SELECT USUCODIGO, USULOGIN, USURE, USUNOME, USUEMAIL, USUFOTO, 
            CAST(USUFACIAL AS VARCHAR(5000)) AS USUFACIAL 
          FROM IAUSUARIO 
          WHERE USUSTATUS = 1 AND USUFACIAL IS NOT NULL`,
          [],
          (err, result) => {
            if (err) reject(err);
            resolve(result);
          }
        );
      });

      if (!users || users.length === 0) {
        return {
          data: null,
          error: true,
          message: "Nenhum usuário encontrado para comparação.",
        };
      }

      let bestMatch: any = null;
      let minDistance = Infinity;

      users.forEach((row: any) => {
        try {
          const sanitizedEmbedding = row.USUFACIAL.trim();

          if (!sanitizedEmbedding.startsWith("[") || !sanitizedEmbedding.endsWith("]")) {
            console.warn(`⚠️ Formato inválido para usuário ${row.USURE}. Pulando...`);
            return;
          }

          const storedEmbedding = JSON.parse(sanitizedEmbedding);

          if (!Array.isArray(storedEmbedding) || storedEmbedding.length !== detectedEmbedding.length) {
            console.warn(`⚠️ Embedding inválido para usuário ${row.USURE}. Pulando...`);
            return;
          }

          const distance = calculateEuclideanDistance(detectedEmbedding, storedEmbedding);
          console.log(`📏 Distância para usuário ${row.USURE}: ${distance}`);

          if (distance < minDistance) {
            minDistance = distance;
            bestMatch = row;
          }

        } catch (parseError) {
          console.error(`❌ Erro ao processar embedding do usuário ${row.USURE}:`, parseError);
        }
      });

      if (bestMatch && minDistance < 0.6) {
        return {
          data: {
            USUCODIGO: bestMatch.USUCODIGO,
            USUNOME: bestMatch.USUNOME,
            USULOGIN: bestMatch.USULOGIN,
            USUEMAIL: bestMatch.USUEMAIL,
            USURE: bestMatch.USURE,
            USUFACIAL: bestMatch.USUFACIAL,
          },
          error: false,
          message: "Autenticação facial realizada com sucesso",
        };
      } else {
        return {
          data: null,
          error: true,
          message: `Nenhum usuário compatível encontrado.`,
        };
      }

    } catch (error) {
      console.error("Erro de autenticação facial:", error);
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