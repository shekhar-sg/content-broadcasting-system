import { StatusCodes } from "http-status-codes";

export namespace HttpError {
  export class AppError extends Error {
    constructor(
      message: string,
      public readonly status: number
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
}
