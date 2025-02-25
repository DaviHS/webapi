import { z } from "zod";

export const authSchema = z.object({
  userLogin: z.string().optional(),
  password: z.string().optional(),
  auth_type: z.string(),
  facial: z.preprocess((val) => {
    if (typeof val === "string") {
      try {
        return JSON.parse(val);
      } catch {
        return [];
      }
    }
    return val;
  }, z.array(z.number()).optional()),
  app_id: z.string().optional(),
});
  
export type AuthInput = z.infer<typeof authSchema>;

export const userSchema = z.object({
  id: z.number().optional(),
  name: z.string().optional(),
  email: z.string().email().optional(),
  facial: z.array(z.number()).optional(),
  photo: z.string().optional(),
});

export const workLogsSchema = z.object({
  re: z.number().optional(),
  name: z.string().optional(),
  status: z.number().int().optional(),
  datahora: z.string().datetime().optional()
});  

export const queryWorkLogSchema = z.object({
  re: z.string().transform((val) => parseInt(val, 10)).refine(val => !isNaN(val), {
    message: 'Expected "re" to be a number',
  }).optional(),
  data_ini: z.string().refine(val => !isNaN(Date.parse(val)), {
    message: 'Invalid date format for data_ini',
  }).optional(),
  data_fim: z.string().refine(val => !isNaN(Date.parse(val)), {
    message: 'Invalid date format for data_fim',
  }).optional(),
});