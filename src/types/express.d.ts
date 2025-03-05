import { IUser } from "@/models/user.model";
import { Request } from "express";

declare module "express" {
  export interface Request {
    user?: IUser;
  }
}
