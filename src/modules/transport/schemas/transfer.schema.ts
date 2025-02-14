import { z } from "zod";

export const transferSchema = z.object({
  origem: z.string(),
  destino: z.string(),
  data: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Data inválida, formato esperado: yyyy-mm-dd"),
  veiculo: z.string(),
});
