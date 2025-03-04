import z from "zod";
import { USER_ROLES } from "../models/user.model";

export const createUserSchema = z.object({
  body: z.object({
    name: z
      .string({ required_error: "Name is required" })
      .min(3, "Name should be at least 3 characters")
      .max(100, "Name should not exceed to 100 characters"),
    email: z
      .string({ required_error: "Email is required" })
      .email("Your provided email is not valid"),
    password: z
      .string({ required_error: "Password is required" })
      .min(6, "Password should be at least 6 characters long")
      .max(18, "Password should not exceed to 18 characters"),
    role: z.nativeEnum(USER_ROLES).optional(),
  }),
});

export type UserSchema = z.infer<typeof createUserSchema>;
