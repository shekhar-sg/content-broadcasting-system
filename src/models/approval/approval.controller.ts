import type { NextFunction, Request, Response } from "express";
import type { AuthGuard } from "../../common/guards/auth.guard";
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
    try {
      const { contentId } = ApprovalSchemas.params.parse(req.params);
      const item = await this.service.approveContent(contentId, req.user!.userId);
      ResponseUtil.success(res, item, "Content approved");
    } catch (error) {
      next(error);
    }
  };

  reject = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { contentId } = ApprovalSchemas.params.parse(req.params);
      const { reason } = ApprovalSchemas.reject.parse(req.body);
      const item = await this.service.rejectContent(contentId, reason);
      ResponseUtil.success(res, item, "Content rejected");
    } catch (error) {
      next(error);
    }
  };
}
