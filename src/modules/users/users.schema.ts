import { z } from "zod";

export const userSchema = z.object({
  id: z.number().optional(),
  name: z.string().optional(),
  email: z.string().email().optional(),
  facial: z.instanceof(Buffer).optional(),
  photo: z.instanceof(Buffer).optional(),
});
