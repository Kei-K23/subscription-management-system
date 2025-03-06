import { SubscriptionService } from "@/services/subscription.service";
import { catchAsync } from "@/utils/catch-async";
import { Request, Response } from "express";

export class SubscriptionController {
  static createSubscription = catchAsync(
    async (req: Request, res: Response) => {
      const subscription = await SubscriptionService.createSubscription(
        req.body
      );

      res.status(201).json({
        status: "success",
        data: { subscription },
      });
    }
  );

  static getAllSubscriptions = catchAsync(
    async (_req: Request, res: Response) => {
      const subscriptions = await SubscriptionService.getAllSubscriptions();

      res.status(200).json({
        status: "success",
        data: subscriptions,
      });
    }
  );

  static getSubscriptionById = catchAsync(
    async (req: Request, res: Response) => {
      const subscription = await SubscriptionService.getSubscriptionById(
        req.params.id
      );

      res.status(200).json({
        status: "success",
        data: { subscription },
      });
    }
  );

  static cancelSubscription = catchAsync(
    async (req: Request, res: Response) => {
      const subscription = await SubscriptionService.updateSubscription(
        req.params.id,
        {
          status: "CANCELED",
        }
      );

      res.status(200).json({
        status: "success",
        data: { subscription },
      });
    }
  );
}
