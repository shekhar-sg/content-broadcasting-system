import type { NextFunction, Request, Response } from "express";
import { ZodError, z } from "zod";
import { HttpError } from "../utils/http.error";

export namespace HttpExceptionFilter {
  export function handle(err: Error, req: Request, res: Response, next: NextFunction): void {
    if (res.headersSent) {
      next(err);
      return;
    }

    if (err instanceof ZodError) {
      res.status(400).json({
        success: false,
        message: "Validation error",
        errors: z.flattenError(err).fieldErrors,
      });
      return;
    }

    const status =
      err instanceof HttpError.AppError
        ? err.status
        : ((err as { status?: number; statusCode?: number }).status ??
          (err as { statusCode?: number }).statusCode ??
          500);

    const message = status === 500 ? "Internal Server Error" : err.message;

    if (status === 500) {
      console.error(`[${new Date().toISOString()}] ${req.method}`, err);
    }

    res.status(status).json({
      success: false,
      message,
      ...(err instanceof HttpError.AppError && err.errors ? { errors: err.errors } : {}),
    });
  }
}
