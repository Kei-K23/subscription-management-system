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

  static getAllPlans = catchAsync(async (req: Request, res: Response) => {
    const plans = await PlanService.getAllPlans();

    res.status(200).json({
      status: "success",
      data: plans,
    });
  });

  static getPlanById = catchAsync(async (req: Request, res: Response) => {
    const plan = await PlanService.getPlanById(req.params.id);

    res.status(200).json({
      status: "success",
      data: { plan },
    });
  });

  static updatePlan = catchAsync(async (req: Request, res: Response) => {
    const plan = await PlanService.updatePlan(req.params.id, req.body);

    res.status(200).json({
      status: "success",
      data: { plan },
    });
  });

  static deletePlan = catchAsync(async (req: Request, res: Response) => {
    await PlanService.deletePlan(req.params.id);

    res.status(200).json({
      status: "success",
      data: {},
    });
  });
}
