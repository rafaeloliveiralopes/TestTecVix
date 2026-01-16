import { z } from "zod";

// Schema específico para edição do próprio perfil (não permite password/role/vínculos).
export const userUpdateSelfSchema = z.object({
  username: z.string().min(1).max(100).optional(),
  email: z.string().email("Invalid email").max(100).optional(),
  userPhoneNumber: z.string().nullable().optional(),
  profileImgUrl: z.string().nullable().optional(),
  fullName: z.string().nullable().optional(),
});

export type TUserUpdateSelf = z.infer<typeof userUpdateSelfSchema>;
