import { z } from "zod";

export const productSchema = z.object({
  id: z.number(),
  name: z.string().min(3, "Nome do produto deve ter pelo menos 3 caracteres"),
  price: z.number().positive("Preço deve ser maior que zero"),
});
