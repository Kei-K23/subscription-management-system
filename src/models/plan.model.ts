import mongoose, { Document } from "mongoose";

export interface IPlan extends Document {
  name: string;
  description: string;
  price: number;
  billingCycle: "MONTHLY" | "YEARLY";
  features?: string[];
  isActive?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const planSchema = new mongoose.Schema<IPlan>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      unique: true,
    },
    description: {
      type: String,
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      validate: {
        validator: function (value: number) {
          return value > 0;
        },
        message: "Price must be greater than 0",
      },
    },
    billingCycle: {
      type: String,
      required: [true, "Billing cycle is required"],
      enum: ["MONTHLY", "YEARLY"],
    },
    features: {
      type: [String],
      default: [],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Plan = mongoose.model<IPlan>("Plan", planSchema);
