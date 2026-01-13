import { z } from "zod";

const EVMStatus = z.enum(["RUNNING", "STOPPED", "PAUSED"]);
const ETaskLocation = z.enum(["bre_barueri", "usa_miami"]);
const MIN_VM_PASS_SIZE = 12;
// Password validation regex
export const passwordRegex = {
  numbers: /(?=.*\d.*\d)/,
  lowercase: /(?=.*[a-z].*[a-z])/,
  uppercase: /(?=.*[A-Z].*[A-Z])/,
  special:
    /(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?].*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?])/,
};

export const vMCreatedSchema = z.object({
  vmName: z.string().optional(),
  vCPU: z.number().min(1, "vCPU must be at least 1"),
  ram: z.number().min(1, "RAM must be at least 1 GB"),
  disk: z.number().min(20, "Disk must be at least 20 GBs"),
  pass: z
    .string()
    .min(MIN_VM_PASS_SIZE, "Password must be at least 12 characters long")
    .refine((password) => passwordRegex.numbers.test(password), {
      message: "Password must contain at least 2 numbers",
    })
    .refine((password) => passwordRegex.lowercase.test(password), {
      message: "Password must contain at least 2 lowercase letters",
    })
    .refine((password) => passwordRegex.uppercase.test(password), {
      message: "Password must contain at least 2 uppercase letters",
    })
    .refine((password) => passwordRegex.special.test(password), {
      message: "Password must contain at least 2 special characters",
    }),
  hasBackup: z.boolean().optional().default(false),
  location: ETaskLocation,
  idBrandMaster: z.number().nullable().optional(),
  status: EVMStatus.optional(),
  os: z.string().optional(),
});

export type TVMCreate = z.infer<typeof vMCreatedSchema>;
