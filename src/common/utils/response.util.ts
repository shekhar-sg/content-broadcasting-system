import type { Response } from "express";
import { StatusCodes } from "http-status-codes";

export namespace ResponseUtil {
  export interface ApiResponse<T = unknown> {
    success: boolean;
    message: string;
    data?: T;
    meta?: Record<string, unknown>;
  }

  export function success<T>(
    res: Response,
    data: T,
    message = "Success",
    statusCode = 200,
    meta: Record<string, unknown>
  ): Response {
    const body: ApiResponse<T> = { success: true, message, data };
    if (meta) body.meta = meta;
    return res.status(statusCode).json(body);
  }

  export function created<T>(res: Response, data: T, message = "Created"): Response {
    return res.status(StatusCodes.CREATED).json({
      success: true,
      message,
      data,
    });
  }

  export function error(
    res: Response,
    message: string,
    statusCode = StatusCodes.INTERNAL_SERVER_ERROR,
    errors?: unknown
  ): Response {
    const body: Record<string, unknown> = { success: false, message };
    if (errors) body.errors = errors;
    return res.status(statusCode).json(body);
  }

  export function notFound(res: Response, message = "Not Found"): Response {
    return res.status(StatusCodes.NOT_FOUND).json({ success: false, message });
  }

  export function forbidden(res: Response, message = "Unauthorized"): Response {
    return res.status(StatusCodes.FORBIDDEN).json({ success: false, message });
  }

  export function unauthorized(res: Response, message = "Unauthorized"): Response {
    return res.status(StatusCodes.UNAUTHORIZED).json({ success: false, message });
  }

  export function badRequest(res: Response, message = "Bad Request", errors?: unknown): Response {
    const body: Record<string, unknown> = { success: false, message };
    if (errors) body.errors = errors;
    return res.status(StatusCodes.BAD_REQUEST).json(body);
  }
}
