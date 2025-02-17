import { z } from "zod";

export const userSchema = z.object({
  id: z.number().optional(),
  name: z.string().optional(),
  email: z.string().email().optional(),
  facial: z.array(z.number()).optional(),
  photo: z.string().optional(),
});

export const userFacialSchema = userSchema.pick({
  id: true,
  facial: true, 
  photo: true,
}); 

export type UserFacialSchema = z.infer<typeof userFacialSchema>;
