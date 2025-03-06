import mongoose, { Schema, Types } from "mongoose";

export interface IPayment {
  user: Types.ObjectId;
  subscription: Types.ObjectId;
  amount: number;
  currency: string;
  status: "PENDING" | "SUCCESS" | "FAILED";
  transactionId: string;
  createdAt: Date;
  updatedAt: Date;
}

const paymentSchema = new mongoose.Schema<IPayment>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
    },
    subscription: {
      type: Schema.Types.ObjectId,
      ref: "Subscription",
      required: [true, "Subscription ID is required"],
    },
    amount: {
      type: Number,
      required: [true, "Amount is required"],
      validate: {
        validator: (value: number) => {
          return value > 0;
        },
        message: "Amount must be greater than 0",
      },
    },
    currency: {
      type: String,
      required: [true, "Currency is required"],
    },
    status: {
      type: String,
      enum: ["PENDING", "SUCCESS", "FAILED"],
      required: [true, "Status is required"],
      default: "PENDING",
    },
    transactionId: {
      type: String,
      required: [true, "Transaction ID is required"],
    },
  },
  {
    timestamps: true,
  }
);

export const Payment = mongoose.model<IPayment>("Payment", paymentSchema);
