import type { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { HttpError } from "../../common/utils/http.error";
import { ResponseUtil } from "../../common/utils/response.util";
import type { UserRecord } from "./auth.contracts";
import { AuthSchemas } from "./auth.schemas";
import type { AuthService } from "./auth.service";

export function sanitizeUser(user: UserRecord): Omit<UserRecord, "passwordHash"> {
  const { passwordHash: _passwordHash, ...safeUser } = user;
  return safeUser;
}

export class AuthController {
  constructor(private readonly service: AuthService) {}

  registerTeacher = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const payload = AuthSchemas.registerTeacher.safeParse(req.body);
      if (!payload.success) {
        throw HttpError.validationError(
          "Validation error",
          z.flattenError(payload.error).fieldErrors
        );
      }
      const result = await this.service.registerTeacher(payload.data);
      ResponseUtil.created(
        res,
        { user: sanitizeUser(result.user) },
        "Teacher account created successfully"
      );
    } catch (error) {
      next(error);
    }
  };

  login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const payload = AuthSchemas.login.safeParse(req.body);
      if (!payload.success) {
        throw HttpError.validationError(
          "Validation error",
          z.flattenError(payload.error).fieldErrors
        );
      }
      const result = await this.service.login(payload.data);
      ResponseUtil.success(
        res,
        {
          token: result.token,
          user: sanitizeUser(result.user),
        },
        "Login successfully"
      );
    } catch (error) {
      next(error);
    }
  };
}
