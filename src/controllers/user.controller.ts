import { UserService } from "@/services/user.service";
import { catchAsync } from "@/utils/catch-async";
import { Request, Response } from "express";

export class UserController {
  static createUser = catchAsync(async (req: Request, res: Response) => {
    const user = await UserService.createUser(req.body);

    res.status(201).json({
      status: "success",
      data: user,
    });
  });

  static getAllUsers = catchAsync(async (_req: Request, res: Response) => {
    const users = await UserService.getAllUsers();

    res.status(200).json({
      status: "success",
      data: users,
    });
  });

  static getUserById = catchAsync(async (req: Request, res: Response) => {
    const user = await UserService.getUserById(req.params.id);

    res.status(200).json({
      status: "success",
      data: { user },
    });
  });

  static updateUser = catchAsync(async (req: Request, res: Response) => {
    const user = await UserService.updateUser(req.params.id, req.body);

    res.status(200).json({
      status: "success",
      data: { user },
    });
  });

  static deleteUser = catchAsync(async (req: Request, res: Response) => {
    await UserService.deleteUser(req.params.id);

    res.status(200).json({
      status: "success",
      data: {},
    });
  });
}
