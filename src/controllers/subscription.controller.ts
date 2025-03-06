import { Plan } from "@/models/plan.model";
import { Subscription } from "@/models/subscription.model";
import { PaymentService } from "@/services/payment.service";
import { SubscriptionService } from "@/services/subscription.service";
import { ApiError } from "@/utils/api-error";
import { catchAsync } from "@/utils/catch-async";
import { stripe } from "@/utils/stripe";
import { Request, Response } from "express";
import { Types } from "mongoose";
import Stripe from "stripe";

export class SubscriptionController {
  static createSubscription = catchAsync(
    async (req: Request, res: Response) => {
      const { checkoutUrl } = await SubscriptionService.createSubscription(
        req.body
      );

      res.status(200).json({
        status: "success",
        data: { checkoutUrl },
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

  static handleStripeWebhook = catchAsync(
    async (req: Request, res: Response) => {
      const sig = req.headers["stripe-signature"]!;
      const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

      const event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        endpointSecret
      );

      if (event.type === "checkout.session.completed") {
        const session = event.data.object as Stripe.Checkout.Session;

        // Retrieve the subscription ID from metadata
        const { userId, planId } = session.metadata as {
          userId: string;
          planId: string;
        };

        const plan = await Plan.findById(planId);

        if (!plan) {
          throw new ApiError(404, "Plan not found");
        }

        // Find the subscription and update status to "ACTIVE"
        const subscription = await Subscription.findOneAndUpdate(
          { user: userId, plan: planId, status: "PENDING" },
          { status: "ACTIVE" },
          { new: true, runValidators: true }
        );

        if (!subscription) {
          throw new ApiError(404, "Subscription not found");
        }

        // Optionally, create a payment record (similar to previous code)
        const payment = await PaymentService.createPayment({
          subscription: subscription.id,
          user: new Types.ObjectId(userId),
          amount: plan.price,
          currency: "USD",
          status: "SUCCESS",
          paymentGateway: "STRIPE",
          transactionId: session.payment_intent as string,
        });

        subscription.paymentHistory.push(payment.id);
        await subscription.save();

        res.status(200).send({
          status: "success",
          message: "Payment processed successfully",
        });
      } else {
        res.status(200).send({
          status: "success",
          message: "Event received",
        });
      }
    }
  );
}
