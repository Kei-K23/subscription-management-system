import { IPlan, Plan } from "@/models/plan.model";
import { ApiError } from "@/utils/api-error";

export class PlanService {
  static async createPlan(plan: Partial<IPlan>) {
    return await Plan.create(plan);
  }

  static async getAllPlans() {
    return await Plan.find();
  }

  static async getPlanById(id: string) {
    const plan = await Plan.findById(id);
    if (!plan) {
      throw new ApiError(404, "Plan not found");
    }
    return plan;
  }

  static async updatePlan(id: string, updatePlanInput: Partial<IPlan>) {
    const updatedPlan = await Plan.findByIdAndUpdate(id, updatePlanInput, {
      new: true,
      runValidators: true,
    });

    if (!updatedPlan) {
      throw new ApiError(404, "Plan not found");
    }

    return updatedPlan;
  }

  static async deletePlan(id: string) {
    const deletedPlan = await Plan.findByIdAndDelete(id, {
      new: true,
      runValidators: true,
    });

    if (!deletedPlan) {
      throw new ApiError(404, "Plan not found");
    }
  }
}
