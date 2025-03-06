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

  static async updateUser(id: string, updateUserInput: Partial<IUser>) {
    const updatedUser = await User.findByIdAndUpdate(id, updateUserInput, {
      new: true,
      runValidators: true,
    });
    if (!updatedUser) {
      throw new ApiError(404, "User not found");
    }

    return updatedUser;
  }

  static async deleteUser(id: string) {
    const deletedUser = await User.findByIdAndDelete(id, {
      new: true,
      runValidators: true,
    });

    if (!deletedUser) {
      throw new ApiError(404, "User not found");
    }
  }
}
