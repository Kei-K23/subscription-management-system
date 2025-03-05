import { AuthController } from "@/controllers/auth.controller";
import { resourceValidate } from "@/middlewares/resource-validate.middleware";
import { loginSchema, registerSchema } from "@/validations/auth.validation";
import { Router } from "express";

const router = Router();

router.post(
  "/register",
  resourceValidate(registerSchema),
  AuthController.register
);
router.post("/login", resourceValidate(loginSchema), AuthController.login);

export const authRoutes = router;
