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
