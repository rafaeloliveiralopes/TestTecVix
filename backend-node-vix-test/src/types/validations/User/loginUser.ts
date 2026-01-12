import { z } from "zod";

export const userLoginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(1, "Password is required"),
});

export type TUserLogin = z.infer<typeof userLoginSchema>;

export default userLoginSchema;
