import { getSqlConnection } from "@/config/db";
import { workLogsSchema } from "@/schemas";
import { createResponse } from "@/lib/utils";
import sql from "mssql";

export class WorkLogsService {
  async getWorkLogs(filters: any) {
    const db = await getSqlConnection(); // Obtendo a conexão do pool

    try {
      let query = `
        SELECT ID, RE, DATAHORA, STATUS, NOME
        FROM PONTO_PJ
        WHERE 1 = 1
      `;

      let queryParams: any[] = [];

      if (filters.re) {
        query += " AND RE = @re";
        queryParams.push({ name: "re", type: sql.Numeric(38, 0), value: filters.re });
      }

      if (filters.datahora_ini && filters.datahora_fim) {
        const startDate = new Date(filters.datahora_ini);
        startDate.setHours(0, 0, 0, 0); 

        const endDate = new Date(filters.datahora_fim);
        endDate.setHours(23, 59, 59, 999); 

        query += " AND DATAHORA BETWEEN @datahora_ini AND @datahora_fim";
        queryParams.push({ name: "datahora_ini", type: sql.DateTime, value: startDate });
        queryParams.push({ name: "datahora_fim", type: sql.DateTime, value: endDate });
      }

      const request = db.request();

      queryParams.forEach((param) => {
        request.input(param.name, param.type, param.value);
      });

      const result = await request.query(query);

      return createResponse(false, "Logs de trabalho encontrados.", result.recordset);
    } catch (err) {
      console.error("Erro ao buscar work logs:", err);
      return createResponse(true, "Erro ao buscar logs de trabalho.", err);
    }
  };

  async createWorkLog(data: any) {
    const log = workLogsSchema.parse(data);
    const db = await getSqlConnection();  

    try {
      const request = db.request(); 
      request.input("re", sql.Numeric(38, 0), log.re);  
      request.input("datahora", sql.DateTime, log.datahora);
      request.input("status", sql.TinyInt, log.status);
      request.input("nome", sql.VarChar(255), log.name);

      const result = await request.query(`
        INSERT INTO PONTO_PJ (RE, DATAHORA, STATUS, NOME)
        VALUES (@re, @datahora, @status, @nome)
      `);

      return createResponse(false, "Ponto de trabalho registrado com sucesso!", result.recordset);
    } catch (err) {

      console.error("Erro ao criar work log:", err);
      return createResponse(true, "Erro ao registrar o ponto de trabalho.", err);
    }
  }
}