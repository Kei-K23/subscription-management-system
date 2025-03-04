import mongoose from "mongoose";
import * as argon2 from "argon2";
import { UserSchema } from "../schemas/create-user-schema";

export enum USER_ROLES {
  ADMIN = "ADMIN",
  USER = "USER",
}

export type UserInput = UserSchema["body"];

export interface UserDocument extends UserInput, mongoose.Document {
  createdAt: Date;
  updatedAt: Date;
  comparePassword(plainPassword: string): Promise<boolean>;
}

const userSchema = new mongoose.Schema<UserDocument>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      minlength: 3,
      maxlength: 100,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: [true, "Email need to be unique"],
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
      maxlength: 18,
    },
    role: {
      type: String,
      enum: [USER_ROLES.ADMIN, USER_ROLES.USER],
      default: USER_ROLES.USER,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  const user = this as UserDocument;

  if (!user.isModified("password")) {
    return next();
  }

  user.password = await argon2.hash(user.password);

  return next();
});

userSchema.methods.comparePassword = async function (plainPassword: string) {
  const user = this as UserDocument;
  return await argon2.verify(user.password, plainPassword);
};

const UserModel = mongoose.model<UserDocument>("User", userSchema);

export default UserModel;
