import { ZodIssue } from "zod";

export class ApiError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(
    statusCode: number,
    message: string,
    isOperational = true,
    stack: string | ZodIssue[] = ""
  ) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    if (stack) {
      this.stack = JSON.stringify(stack);
    } else {
      Error.captureStackTrace(this);
    }
  }
}
