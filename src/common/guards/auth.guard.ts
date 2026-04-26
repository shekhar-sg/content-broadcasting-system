import type { NextFunction, Request, Response } from "express";
import { JWT } from "../utils/jwt.util";
import { ResponseUtil } from "../utils/response.util";

export namespace AuthGuard {
  export interface AuthRequest extends Request {
    user?: JWT.Payload;
  }

  export function authenticate(req: AuthRequest, res: Response, next: NextFunction): void {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      ResponseUtil.unauthorized(res, "No token provided");
      return;
    }

    const token = authHeader.slice(7);
    try {
      req.user = JWT.verify(token);
      next();
    } catch {
      ResponseUtil.unauthorized(res, "Invalid or expired token");
    }
  }
}
