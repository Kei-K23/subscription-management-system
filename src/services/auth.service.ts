import { config } from "@/config";
import { IUser, User } from "@/models/user.model";
import { ApiError } from "@/utils/api-error";
import jwt, { SignOptions } from "jsonwebtoken";

export class AuthService {
  static async register(user: Partial<IUser>): Promise<IUser> {
    const existingUser = await User.findOne({ email: user.email });

    if (existingUser) {
      throw new ApiError(400, "Email already taken");
    }
    return User.create(user);
  }

  static async login({
    email,
    password,
  }: {
    email: string;
    password: string;
  }): Promise<{ user: IUser; token: string }> {
    const existingUser = await User.findOne({ email });

    if (!existingUser || !(await existingUser.comparePassword(password))) {
      throw new ApiError(400, "Invalid email or password");
    }

    // Generate token
    const token = jwt.sign(
      { id: existingUser._id, role: existingUser.role },
      config.jwt.secret,
      {
        expiresIn: config.jwt.expiresIn,
      }
    );

    return { user: existingUser, token };
  }

  static async verifyToken(token: string): Promise<IUser> {
    try {
      const decode = jwt.verify(token, config.jwt.secret) as { id: string };
      const user = await User.findById(decode.id);

      if (!user) {
        throw new ApiError(400, "User not found");
      }

      return user;
    } catch (error) {
      throw new ApiError(401, "Invalid token");
    }
  }
}
