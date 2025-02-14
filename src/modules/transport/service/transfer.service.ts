import { poolPromise  } from "../../../config/db";
import { transferSchema } from "../schemas/transfer.schema";
import { z } from "zod";

export const getTransfersService = async () => {
  const conn = await poolPromise;
  const transfers = await conn.request().query("SELECT * FROM transfers");
  return transfers;
};

export const createTransferService = async (data: any) => {
  try {
    const parsedData = transferSchema.parse(data);
      const conn = await poolPromise;
  
    const result = await conn
      .request()
      .input("origem", parsedData.origem)
      .input("destino", parsedData.destino)
      .input("data", parsedData.data)
      .input("veiculo", parsedData.veiculo) 
      .query(`
        INSERT INTO transfers (origem, destino, data, veiculo) 
        VALUES (@origem, @destino, @data, @veiculo)
      `);
  
    return { success: true, message: "Romaneio cadastrado com sucesso", data: parsedData };
  } catch (error) {
    console.error("Erro ao inserir romaneio:", error);
  
    if (error instanceof z.ZodError) {
      return { success: false, error: "Erro de validação", details: error.errors };
    }

    return { success: false, error: "Erro ao inserir romaneio no banco de dados" };
  }
};