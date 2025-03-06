import { Plan } from "@/models/plan.model";
import { ISubscription, Subscription } from "@/models/subscription.model";
import { ApiError } from "@/utils/api-error";
import { addMonths, addYears } from "date-fns";

export class SubscriptionService {
  static async createSubscription({
    userId,
    planId,
  }: {
    userId: string;
    planId: string;
  }) {
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

    // TODO : Need to call payment gateway (e.g Stripe)
    // TODO : Need to call payment service

    return await Subscription.create({
      user: userId,
      plan: planId,
      status: "ACTIVE",
      startDate: subscriptionStartDate,
      endDate: subscriptionEndDate,
      nextBillingDate,
      paymentHistory: [], // TODO : Need to add payment history
    });
  }

  static async getAllSubscriptions() {
    return await Subscription.find();
  }

  static async getSubscriptionById(id: string) {
    const subscription = await Subscription.findById(id)
      .populate("user")
      .populate("plan");

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
