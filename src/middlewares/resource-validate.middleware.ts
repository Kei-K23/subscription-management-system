import { ApiError } from "@/utils/api-error";
import { NextFunction, Request, Response } from "express";
import { AnyZodObject } from "zod";

export const resourceValidate =
  (schema: AnyZodObject) =>
  async (req: Request, _res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        params: req.params,
        query: req.query,
      });

      next();
    } catch (error) {
      next(new ApiError(400, "Validation error"));
    }
  };
