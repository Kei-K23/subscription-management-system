import { Plan } from "@/models/plan.model";
import { ISubscription, Subscription } from "@/models/subscription.model";
import { ApiError } from "@/utils/api-error";
import { addMonths, addYears } from "date-fns";
import { PaymentService } from "./payment.service";
import { Types } from "mongoose";

export class SubscriptionService {
  static async createSubscription({
    userId,
    planId,
  }: {
    userId: string;
    planId: string;
  }) {
    // Check user already subscribe the plan
    const existingSubscriptionActive = await Subscription.findOne({
      user: userId,
      plan: planId,
      status: {
        $in: ["ACTIVE"],
      },
    });

    if (existingSubscriptionActive) {
      throw new ApiError(400, "User already has an active subscription");
    }

    // Get plan
    const plan = await Plan.findById(planId);
    if (!plan) {
      throw new ApiError(404, "Plan not found to make subscription");
    }

    const subscriptionStartDate = new Date();
    let subscriptionEndDate = new Date();

    if (plan.billingCycle === "MONTHLY") {
      subscriptionEndDate = addMonths(subscriptionStartDate, 1);
    } else if (plan.billingCycle === "YEARLY") {
      subscriptionEndDate = addYears(subscriptionStartDate, 1);
    } else {
      throw new ApiError(400, "Invalid billing cycle");
    }

    const nextBillingDate = subscriptionEndDate;

    // Call Stripe webhook
    const paymentStatus = "SUCCESS";

    // TODO : Need to call payment gateway (e.g Stripe)
    // TODO : Need to call payment service

    const subscription = await Subscription.create({
      user: new Types.ObjectId(userId),
      plan: new Types.ObjectId(planId),
      startDate: subscriptionStartDate,
      endDate: subscriptionEndDate,
      nextBillingDate,
      paymentMethod: "STRIPE",
      status: paymentStatus === "SUCCESS" ? "ACTIVE" : "PENDING",
    });

    // Call payment service
    const payment = await PaymentService.createPayment({
      subscription: subscription.id,
      user: new Types.ObjectId(userId),
      amount: plan.price,
      currency: "USD",
      status: paymentStatus,
      paymentGateway: "STRIPE",
      transactionId: `fake-${Date.now()}`,
    });

    subscription.paymentHistory.push(payment.id);
    await subscription.save();

    return subscription;
  }

  static async getAllSubscriptions() {
    return await Subscription.find();
  }

  static async getSubscriptionById(id: string) {
    const subscription = await Subscription.findById(id)
      .populate("user")
      .populate("plan")
      .populate("paymentHistory");

    if (!subscription) {
      throw new ApiError(404, "Subscription not found");
    }
    return subscription;
  }

  static async updateSubscription(
    id: string,
    subscriptionInput: Partial<ISubscription>
  ) {
    const updatedSubscription = await Subscription.findByIdAndUpdate(
      id,
      subscriptionInput,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedSubscription) {
      throw new ApiError(404, "Subscription not found");
    }
    return updatedSubscription;
  }
}
