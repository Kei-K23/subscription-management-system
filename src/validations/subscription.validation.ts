import { z } from "zod";

export const subscriptionCreateSchema = z.object({
  body: z.object({
    userId: z.string({ required_error: "User id required" }),
    planId: z.string({ required_error: "Plan id required" }),
  }),
});

export const subscriptionParamIdSchema = z.object({
  params: z.object({
    id: z.string({ required_error: "Id required" }),
  }),
});
