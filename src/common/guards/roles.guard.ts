import type { NextFunction, RequestHandler, Response } from "express";
import { ResponseUtil } from "../utils/response.util";
import type { AuthGuard } from "./auth.guard";

export namespace RolesGuard {
  export function authorize(...roles: string[]): RequestHandler {
    return (req: AuthGuard.AuthRequest, res: Response, next: NextFunction) => {
      if (!req.user) {
        ResponseUtil.unauthorized(res);
        return;
      }
      if (!roles.includes(req.user.role)) {
        ResponseUtil.forbidden(res, "Insufficient permissions");
        return;
      }
      next();
    };
  }
}
