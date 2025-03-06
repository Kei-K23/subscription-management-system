import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcryptjs";
import { ISubscription } from "./subscription.model";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: "USER" | "ADMIN";
  isEmailVerified?: boolean;
  createdAt: Date;
  updatedAt: Date;
  subscriptions?: ISubscription[];
  comparePassword(plainPass: string): Promise<boolean>;
}

const userSchema = new mongoose.Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [3, "Name must be at least 3 characters long"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      trim: true,
      minlength: [6, "Password must be at least 6 characters long"],
      select: false,
    },
    role: {
      type: String,
      enum: ["USER", "ADMIN"],
      default: "USER",
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    subscriptions: [
      {
        subscription: {
          type: Schema.Types.ObjectId,
          ref: "Subscription",
        },
      },
    ],
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret) {
        delete ret.password;
        return ret;
      },
    },
  }
);

userSchema.pre("save", async function (next) {
  // If not modify the password, then return
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    return next();
  } catch (error: any) {
    return next(error);
  }
});

userSchema.methods.comparePassword = async function (
  plainPass: string
): Promise<boolean> {
  return bcrypt.compare(plainPass, this.password);
};

export const User = mongoose.model<IUser>("User", userSchema);
