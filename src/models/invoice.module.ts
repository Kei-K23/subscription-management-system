import mongoose, { Schema, Types } from "mongoose";

export interface IInvoice {
  user: Types.ObjectId;
  subscription: Types.ObjectId;
  amount: number;
  currency: string;
  dueDate: Date;
  status: "PAID" | "UNPAID" | "OVERDUE";
  createdAt: Date;
  updatedAt: Date;
}

const invoiceSchema = new mongoose.Schema<IInvoice>(
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
      enum: ["PAID", "UNPAID", "OVERDUE"],
      required: [true, "Status is required"],
      default: "UNPAID",
    },
  },
  {
    timestamps: true,
  }
);

export const Invoice = mongoose.model<IInvoice>("Invoice", invoiceSchema);
