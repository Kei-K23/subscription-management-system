import { PlanService } from "@/services/plan.service";
import { catchAsync } from "@/utils/catch-async";
import { Request, Response } from "express";

export class PlanController {
  static createPlan = catchAsync(async (req: Request, res: Response) => {
    const plan = await PlanService.createPlan(req.body);

    res.status(201).json({
      status: "success",
      data: { plan },
    });
  });
}
