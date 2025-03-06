import { z } from "zod";

export const userParamIdSchema = z.object({
  params: z
    .object({
      id: z.string({ required_error: "Id param is required" }),
    })
    .strict(),
});

export const userUpdateSchema = z.object({
  body: z
    .object({
      name: z
        .string()
        .min(3, "Name must be at least 3 characters long")
        .optional(),
      email: z.string().email("Invalid email format").optional(),
      password: z
        .string()
        .min(6, "Password must be at least 3 characters long")
        .optional(),
      role: z.enum(["USER", "ADMIN"]).optional(),
    })
    .strict(),
});

export const userCreateSchema = z.object({
  body: z
    .object({
      name: z.string().min(3, "Name must be at least 3 characters long"),
      email: z.string().email("Invalid email format"),
      password: z
        .string()
        .min(6, "Password must be at least 3 characters long"),
      role: z.enum(["USER", "ADMIN"]).optional(),
    })
    .strict(),
});
