import { Plan } from "@/models/plan.model";
import { ISubscription, Subscription } from "@/models/subscription.model";
import { ApiError } from "@/utils/api-error";
import { addMonths, addYears } from "date-fns";
import { Types } from "mongoose";
import { stripe } from "@/utils/stripe";
import { config } from "@/config";

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

    // TODO Modify Stripe checkout session to handle subscription base or one month payment
    // Create a Stripe Checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: plan.name,
              description: plan.description,
            },
            unit_amount: plan.price * 100, // Amount in cents
            recurring: {
              interval: plan.billingCycle === "MONTHLY" ? "month" : "year", // Set billing cycle
              interval_count: 1, // 1 month or 1 year
            },
          },
          quantity: 1,
        },
      ],
      mode: "subscription", // This indicates a subscription checkout
      success_url: `${config.appUrl}/api/v1/subscriptions/subscription-success`,
      cancel_url: `${config.appUrl}/api/v1/subscriptions/subscription-failed`,
      metadata: {
        userId,
        planId,
      },
    });

    await Subscription.create({
      user: new Types.ObjectId(userId),
      plan: new Types.ObjectId(planId),
      startDate: subscriptionStartDate,
      endDate: subscriptionEndDate,
      nextBillingDate,
      paymentMethod: "STRIPE",
    });

    return { checkoutUrl: session.url };
  }

  static async getAllSubscriptions() {
    return await Subscription.find();
  }

  static async getSubscriptionById(id: string) {
    const subscription = await Subscription.findById(id)
      .populate({
        path: "user",
        model: "User",
      })
      .populate({
        path: "plan",
        model: "Plan",
      })
      .populate({
        path: "paymentHistory",
        model: "Payment",
      });

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
