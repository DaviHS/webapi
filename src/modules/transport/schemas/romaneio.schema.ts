import { z } from "zod";

export const romaneioSchema = z.object({
  codigo: z.string().min(5, "O código do romaneio deve ter pelo menos 5 caracteres"),
  data: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Data inválida, formato esperado: yyyy-mm-dd"),
  motorista: z.string(),
});