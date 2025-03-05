import mongoose from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser {
  name: string;
  email: string;
  password: string;
  role: "USER" | "ADMIN";
  isEmailVerified?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new mongoose.Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 6,
      maxlength: 18,
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
