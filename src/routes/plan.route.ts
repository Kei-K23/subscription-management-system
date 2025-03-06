import { PlanController } from "@/controllers/plan.controller";
import { authenticate, authorize } from "@/middlewares/auth.middleware";
import { resourceValidate } from "@/middlewares/resource-validate.middleware";
import {
  planCreateSchema,
  planParamIdSchema,
  planUpdateSchema,
} from "@/validations/plan.validation";
import { Router } from "express";

const router = Router();

router.post(
  "/",
  authenticate,
  authorize(["ADMIN"]),
  resourceValidate(planCreateSchema),
  PlanController.createPlan
);
router.get(
  "/",
  authenticate,
  authorize(["ADMIN", "USER"]),
  PlanController.getAllPlans
);
router.get(
  "/:id",
  authenticate,
  authorize(["ADMIN", "USER"]),
  resourceValidate(planParamIdSchema),
  PlanController.getPlanById
);
router.patch(
  "/:id",
  authenticate,
  authorize(["ADMIN"]),
  resourceValidate(planParamIdSchema),
  resourceValidate(planUpdateSchema),
  PlanController.updatePlan
);
router.delete(
  "/:id",
  authenticate,
  authorize(["ADMIN"]),
  resourceValidate(planParamIdSchema),
  PlanController.deletePlan
);

export const planRoutes = router;
