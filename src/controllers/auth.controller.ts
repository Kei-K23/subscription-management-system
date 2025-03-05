import { AuthService } from "@/services/auth.service";
import { catchAsync } from "@/utils/catch-async";
import { Request, Response } from "express";

export class AuthController {
  static register = catchAsync(async (req: Request, res: Response) => {
    const user = await AuthService.register(req.body);

    res.status(201).json({
      status: "success",
      data: { user },
    });
  });

  static login = catchAsync(async (req: Request, res: Response) => {
    const { user, token } = await AuthService.login(req.body);

    res.status(201).json({
      status: "success",
      data: { user, token },
    });
  });
}
