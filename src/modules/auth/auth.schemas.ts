import { z } from "zod";

export const loginSchema = z.object({
  userLogin: z.string(),
  password: z.string(),
  auth_type: z.string(),
  app_id: z.string().optional(),
});

export type LoginInput = z.infer<typeof loginSchema>;
