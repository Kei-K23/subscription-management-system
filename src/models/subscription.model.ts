import mongoose, { Types } from "mongoose";

export interface ISubscription {
  user: Types.ObjectId;
  plan: Types.ObjectId;
  status: "ACTIVE" | "CANCELED" | "EXPIRED";
  startDate: Date;
  endDate: Date;
  nextBillingDate: Date;
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
    paymentHistory: [
      {
        amount: {
          type: Number,
          required: [true, "Payment history amount is required"],
        },
        date: {
          type: Date,
          required: [true, "Payment history date is required"],
        },
        status: {
          type: String,
          enum: ["SUCCESS", "FAILED"],
          required: [true, "Payment history status is required"],
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
