import { NextFunction, Request, Response } from "express";
import { AnyZodObject } from "zod";

export const validateResources =
  (schema: AnyZodObject) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });

      next();
    } catch (error) {
      res.status(400).send(error);
    }
  };
