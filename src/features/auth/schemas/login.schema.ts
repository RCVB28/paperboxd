import { z } from "zod";

export const LoginSchema = z.object({
  email: z.email("Please enter a valid email address.").trim().toLowerCase(),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters.")
    .max(100, "Password cannot exceed 100 characters."),
});

export type LoginInput = z.infer<typeof LoginSchema>;
