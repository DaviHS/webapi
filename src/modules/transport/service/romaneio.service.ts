import { poolPromise } from "../../../config/db"; 
import { romaneioSchema } from "../schemas/romaneio.schema";
import { z } from "zod";


export const getRomaneiosService = async () => {
    const conn = await poolPromise;
    const romaneios = await conn.query("SELECT * FROM romaneios");

    return romaneios;
};

export const createRomaneioService = async (data: any) => {
    try {
        const parsedData = romaneioSchema.parse(data);
  
        const conn = await poolPromise;
  
        const result = await conn
            .request()
            .input("codigo", parsedData.codigo)
            .input("data", parsedData.data)
            .input("motorista", parsedData.motorista)
            .query(`
            INSERT INTO romaneios (codigo, data, motorista) 
            VALUES (@codigo, @data, @motorista)
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