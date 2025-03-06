import { z } from "zod";

export const planCreateSchema = z.object({
  body: z.object({
    name: z.string({ required_error: "Name is required" }),
    description: z.string().optional(),
    price: z.number().positive("Price need to positive number"),
    billingCycle: z.enum(["MONTHLY", "YEARLY"]),
    features: z.array(z.string()).default([]).optional(),
    isActive: z.boolean().default(true).optional(),
  }),
});

export const planUpdateSchema = z.object({
  body: z.object({
    name: z.string({ required_error: "Name is required" }).optional(),
    description: z.string().optional(),
    price: z.number().positive("Price need to positive number").optional(),
    billingCycle: z.enum(["MONTHLY", "YEARLY"]).optional(),
    features: z.array(z.string()).default([]).optional(),
    isActive: z.boolean().default(true).optional(),
  }),
});

export const planParamIdSchema = z.object({
  params: z
    .object({
      id: z.string({ required_error: "Id param is required" }),
    })
    .strict(),
});
