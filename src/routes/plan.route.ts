import { PlanController } from "@/controllers/plan.controller";
import { resourceValidate } from "@/middlewares/resource-validate.middleware";
import {
  planCreateSchema,
  planParamIdSchema,
  planUpdateSchema,
} from "@/validations/plan.validation";
import { Router } from "express";

const router = Router();

router.post("/", resourceValidate(planCreateSchema), PlanController.createPlan);
router.get("/", PlanController.getAllPlans);
router.get(
  "/:id",
  resourceValidate(planParamIdSchema),
  PlanController.getPlanById
);
router.patch(
  "/:id",
  resourceValidate(planParamIdSchema),
  resourceValidate(planUpdateSchema),
  PlanController.updatePlan
);
router.delete(
  "/:id",
  resourceValidate(planParamIdSchema),
  PlanController.deletePlan
);

export const planRoutes = router;
