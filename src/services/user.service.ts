import { IUser, User } from "@/models/user.model";
import { ApiError } from "@/utils/api-error";

export class UserService {
  static async createUser(user: Partial<IUser>) {
    return await User.create(user);
  }

  static async getAllUsers() {
    return await User.find();
  }

  static async getUserById(id: string) {
    const user = await User.findById(id);
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    return user;
  }

  static async updateUser(id: string, updateUser: Partial<IUser>) {
    const user = await User.findById(id);
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    return await User.findByIdAndUpdate(id, updateUser, {
      new: true,
    });
  }

  static async deleteUser(id: string) {
    const user = await User.findById(id);
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    await User.findByIdAndDelete(id);
  }
}
