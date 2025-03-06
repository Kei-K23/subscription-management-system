import { z } from "zod";

export const registerSchema = z.object({
  body: z
    .object({
      name: z.string().min(3, "Name must be at least 3 characters long"),
      email: z.string().email("Invalid email format"),
      password: z
        .string()
        .min(6, "Password must be at least 3 characters long"),
    })
    .strict(),
});

export const loginSchema = z.object({
  body: z
    .object({
      email: z.string().email("Invalid email format"),
      password: z
        .string()
        .min(6, "Password must be at least 3 characters long"),
    })
    .strict(),
});
