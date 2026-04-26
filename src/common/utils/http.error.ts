import { StatusCodes } from "http-status-codes";
import {$ZodErrorTree} from "zod/v4/core";

export namespace HttpError {
  export class AppError extends Error {
    constructor(
      message: string,
      public readonly status: number,
      public readonly errors?: Record<string, string[] | undefined>
    ) {
      super(message);
      this.name = "AppError";
    }
  }

  export function notFound(message = "Not found"): AppError {
    return new AppError(message, StatusCodes.NOT_FOUND);
  }

  export function forbidden(message = "Forbidden"): AppError {
    return new AppError(message, StatusCodes.FORBIDDEN);
  }

  export function unauthorized(message = "Unauthorized"): AppError {
    return new AppError(message, StatusCodes.UNAUTHORIZED);
  }

  export function badRequest(message = "Bad request"): AppError {
    return new AppError(message, StatusCodes.BAD_REQUEST);
  }

  export function conflict(message = "Conflict"): AppError {
    return new AppError(message, StatusCodes.CONFLICT);
  }

  export function validationError(
    message = "Validation error",
    errors: { [p: string]: string[]; [p: number]: string[]; [p: symbol]: string[] }
  ): HttpError.AppError {
    return new AppError(message, StatusCodes.BAD_REQUEST, errors);
  }
}
