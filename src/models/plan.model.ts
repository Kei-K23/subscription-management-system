import mongoose from "mongoose";

export interface IPlan {
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
      required: true,
      unique: true,
    },
    description: {
      type: String,
    },
    price: {
      type: Number,
      validate: {
        validator: function (value: number) {
          return value > 0;
        },
        message: "Price must be greater than 0",
      },
    },
    billingCycle: {
      type: String,
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
