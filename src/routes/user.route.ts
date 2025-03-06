import { UserController } from "@/controllers/user.controller";
import { authenticate, authorize } from "@/middlewares/auth.middleware";
import { resourceValidate } from "@/middlewares/resource-validate.middleware";
import {
  userCreateSchema,
  userParamIdSchema,
  userUpdateSchema,
} from "@/validations/user.validation";
import { Router } from "express";

const router = Router();

router.post(
  "/",
  authenticate,
  authorize(["ADMIN"]),
  resourceValidate(userCreateSchema),
  UserController.createUser
);
router.get("/", authenticate, authorize(["ADMIN"]), UserController.getAllUsers);
router.get("/me", authenticate, UserController.getMe);
router.get(
  "/:id",
  authenticate,
  authorize(["ADMIN"]),
  resourceValidate(userParamIdSchema),
  UserController.getUserById
);
router.patch(
  "/me",
  authenticate,
  resourceValidate(userUpdateSchema),
  UserController.updateMe
);
router.patch(
  "/:id",
  authenticate,
  authorize(["ADMIN"]),
  resourceValidate(userParamIdSchema),
  resourceValidate(userUpdateSchema),
  UserController.updateUser
);
router.delete("/me", authenticate, UserController.deleteMe);
router.delete(
  "/:id",
  authenticate,
  authorize(["ADMIN"]),
  resourceValidate(userParamIdSchema),
  UserController.deleteUser
);

export const userRoutes = router;
