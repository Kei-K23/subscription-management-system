import { PlanController } from "@/controllers/plan.controller";
import { resourceValidate } from "@/middlewares/resource-validate.middleware";
import { planCreateSchema } from "@/validations/plan.validation";
import { Router } from "express";

const router = Router();

router.post("/", resourceValidate(planCreateSchema), PlanController.createPlan);

export const planRoutes = router;
