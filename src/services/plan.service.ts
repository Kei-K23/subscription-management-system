import { IPlan, Plan } from "@/models/plan.model";

export class PlanService {
  static async createPlan(plan: Partial<IPlan>) {
    return await Plan.create(plan);
  }
}
