import type { NextFunction, Request, Response } from "express";
import { z } from "zod";
import type { AuthGuard } from "../../common/guards/auth.guard";
import { HttpError } from "../../common/utils/http.error";
import { ResponseUtil } from "../../common/utils/response.util";
import { ApprovalSchemas } from "./approval.schemas";
import type { ApprovalService } from "./approval.service";

export class ApprovalController {
  constructor(private readonly service: ApprovalService) {}

  listPending = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const items = await this.service.listPending();
      ResponseUtil.success(res, items, "Pending content fetched");
    } catch (error) {
      next(error);
    }
  };

  approve = async (
    req: AuthGuard.AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const params = ApprovalSchemas.params.safeParse(req.params);
    if (!params.success) {
      next(HttpError.validationError("Validation error", z.flattenError(params.error).fieldErrors));
      return;
    }

    try {
      const item = await this.service.approveContent(params.data.contentId, req.user!.userId);
      ResponseUtil.success(res, item, "Content approved");
    } catch (error) {
      next(error);
    }
  };

  reject = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const params = ApprovalSchemas.params.safeParse(req.params);
    if (!params.success) {
      next(HttpError.validationError("Validation error", z.flattenError(params.error).fieldErrors));
      return;
    }

    const body = ApprovalSchemas.reject.safeParse(req.body);
    if (!body.success) {
      next(HttpError.validationError("Validation error", z.flattenError(body.error).fieldErrors));
      return;
    }

    try {
      const item = await this.service.rejectContent(params.data.contentId, body.data.reason);
      ResponseUtil.success(res, item, "Content rejected");
    } catch (error) {
      next(error);
    }
  };
}


