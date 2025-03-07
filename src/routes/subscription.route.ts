import { SubscriptionController } from "@/controllers/subscription.controller";
import { resourceValidate } from "@/middlewares/resource-validate.middleware";
import {
  subscriptionCreateSchema,
  subscriptionParamIdSchema,
} from "@/validations/subscription.validation";
import { Router } from "express";

const router = Router();

router.post(
  "/checkout",
  resourceValidate(subscriptionCreateSchema),
  SubscriptionController.createSubscription
);

router.get("/", SubscriptionController.getAllSubscriptions);
router.get(
  "/subscription-success",
  SubscriptionController.subscriptionSuccessHandler
);
router.get(
  "/subscription-failed",
  SubscriptionController.subscriptionFailedHandler
);
router.get(
  "/:id",
  resourceValidate(subscriptionParamIdSchema),
  SubscriptionController.getSubscriptionById
);
router.patch(
  "/:id/cancel",
  resourceValidate(subscriptionParamIdSchema),
  SubscriptionController.cancelSubscription
);

export const subscriptionRoutes = router;
