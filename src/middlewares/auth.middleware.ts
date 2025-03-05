import { AuthService } from "@/services/auth.service";
import { ApiError } from "@/utils/api-error";
import { NextFunction, Request, Response } from "express";

export const authenticate = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
      throw new ApiError(401, "Authentication required");
    }

    const user = await AuthService.verifyToken(token);
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

export const authorize =
  (roles: string[]) =>
  async (req: Request, _res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        throw new ApiError(401, "Authentication required");
      }

      if (!roles.includes(req.user.role)) {
        throw new ApiError(403, "Unauthorized");
      }

      next();
    } catch (error) {
      next(error);
    }
  };
