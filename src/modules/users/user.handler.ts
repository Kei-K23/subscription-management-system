import { Request, Response } from "express";
import logger from "../../lib/logger";
import { UserSchema } from "./schemas/create-user-schema";
import { createUser } from "./user.service";

export const createUserHandler = async (
  req: Request<{}, {}, UserSchema["body"]>,
  res: Response
) => {
  try {
    const user = await createUser(req.body);
    res.status(201).json(user);
  } catch (error) {
    logger.error(error);
    if (error instanceof Error) {
      res.status(500).json({
        statusCode: 500,
        error: error.name,
        message: error.message,
      });
    } else {
      res.status(500).json({
        statusCode: 500,
        error: "Unknown",
        message: "An unknown error occurred when creating user",
      });
    }
  }
};
