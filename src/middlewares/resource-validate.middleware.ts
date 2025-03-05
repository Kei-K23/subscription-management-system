import { ApiError } from "@/utils/api-error";
import { NextFunction, Request, Response } from "express";
import { AnyZodObject, ZodError } from "zod";

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
      if (error instanceof ZodError) {
        next(new ApiError(400, "Validation error", true, error.errors));
      } else {
        next(new ApiError(400, "Validation error"));
      }
    }
  };
