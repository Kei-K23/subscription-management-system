import { z } from "zod";

export const userParamIdSchema = z.object({
  params: z
    .object({
      id: z.string(),
    })
    .strict(),
});

export const userUpdateSchema = z.object({
  body: z
    .object({
      name: z.string().optional(),
      email: z.string().email().optional(),
      password: z.string().min(6).max(18).optional(),
      role: z.enum(["USER", "ADMIN"]).optional(),
    })
    .strict(),
});

export const userCreateSchema = z.object({
  body: z
    .object({
      name: z.string(),
      email: z.string().email(),
      password: z.string().min(6).max(18),
      role: z.enum(["USER", "ADMIN"]).optional(),
    })
    .strict(),
});
