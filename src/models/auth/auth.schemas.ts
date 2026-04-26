import { z } from "zod";

export const AuthSchemas = {
  registerTeacher: z
    .object({
      name: z.string().trim().min(2).max(100),
      email: z.email().transform((value) => value.toLowerCase()),
      password: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .max(128, "Password must be less than 128 characters")
        .regex(/[A-Z]/, "Password must include one uppercase letter")
        .regex(/[a-z]/, "Password must include one lowercase letter")
        .regex(/[0-9]/, "Password must include one number")
        .regex(/[^A-Za-z0-9]/, "Password must include one special character"),
      confirmPassword: z.string({ error: "Password is required" }),
    })
    .refine((data) => data.password === data.confirmPassword, {
      error: "Passwords do not match",
      path: ["confirmPassword"],
    }),
  login: z.object({
    email: z.string().trim().min(2).max(100),
    password: z.string().min(1),
  }),
};

export type RegisterTeacherInput = z.infer<typeof AuthSchemas.registerTeacher>;
export type LoginInput = z.infer<typeof AuthSchemas.login>;
