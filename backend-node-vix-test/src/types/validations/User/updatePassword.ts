import { z } from "zod";

export const userUpdatePasswordSchema = z.object({
  password: z.string().min(8, "Password must be at least 8 characters long"),
});

export type TUserUpdatePassword = z.infer<typeof userUpdatePasswordSchema>;
