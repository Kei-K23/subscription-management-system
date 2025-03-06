import mongoose, { Schema, Types } from "mongoose";
import { type } from "os";

export interface ISubscription {
  user: Types.ObjectId;
  plan: Types.ObjectId;
  status: "ACTIVE" | "CANCELED" | "EXPIRED";
  startDate: Date;
  endDate: Date;
  nextBillingDate: Date;
  autoRenew?: boolean;
  paymentMethod: "CREDIT_CARD" | "PAYPAL" | "STRIPE"; // Currently only support Strip integration
  paymentHistory: {
    amount: number;
    date: Date;
    status: "SUCCESS" | "FAILED";
  };
  createdAt: Date;
  updatedAt: Date;
}

const subscriptionSchema = new mongoose.Schema<ISubscription>(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
    },
    plan: {
      type: mongoose.Schema.ObjectId,
      ref: "Plan",
      required: [true, "Plan ID is required"],
    },
    status: {
      type: String,
      enum: ["ACTIVE", "CANCELED", "EXPIRED"],
      default: "ACTIVE",
    },
    startDate: {
      type: Date,
      required: [true, "Start date is required"],
    },
    endDate: {
      type: Date,
      required: [true, "End date is required"],
    },
    nextBillingDate: {
      type: Date,
      required: [true, "Next billing date is required"],
    },
    autoRenew: {
      type: Boolean,
      default: true,
    },
    paymentHistory: [
      {
        payment: {
          type: Schema.Types.ObjectId,
          ref: "Payment",
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const Subscription = mongoose.model<ISubscription>(
  "Subscription",
  subscriptionSchema
);
