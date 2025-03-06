import { z } from "zod";

export const planCreateSchema = z.object({
  body: z.object({
    name: z.string(),
    description: z.string().optional(),
    price: z.number().positive(),
    billingCycle: z.enum(["MONTHLY", "YEARLY"]),
    features: z.array(z.string()).default([]).optional(),
    isActive: z.boolean().default(true).optional(),
  }),
});

export const planUpdateSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    description: z.string().optional(),
    price: z.number().positive().optional(),
    billingCycle: z.enum(["MONTHLY", "YEARLY"]).optional(),
    features: z.array(z.string()).default([]).optional(),
    isActive: z.boolean().default(true).optional(),
  }),
});

export const planParamIdSchema = z.object({
  params: z
    .object({
      id: z.string(),
    })
    .strict(),
});
