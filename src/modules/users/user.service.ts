import { omit } from "../../lib/utils/omit";
import UserModel, { UserInput } from "./models/user.model";

export const createUser = async (userInput: UserInput) => {
  try {
    const user = await UserModel.create(userInput);
    // Omit the password field and never export in HTTP response
    return omit(user.toJSON(), ["password"]);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("An unknown error occurred when creating user");
    }
  }
};
