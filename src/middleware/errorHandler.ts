import { NextFunction, Request, Response } from "express";
import { AppError } from "../errors/AppError";

export function errorHandler(err: Error, req: Request, res: Response, next: NextFunction): void {
  if (res.headersSent) {
    return next(err);
  }

  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      error: err.message,
      status: "error",
    });
    return;
  }

  console.error(err);
  res.status(500).json({
    error: "Internal server error",
    status: "error",
  });
}
