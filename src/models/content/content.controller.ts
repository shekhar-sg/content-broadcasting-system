import type { NextFunction, Request, Response } from "express";
import type { AuthGuard } from "../../common/guards/auth.guard";
import { ResponseUtil } from "../../common/utils/response.util";
import type { ContentRecord } from "./content.contracts";
import type { ContentService } from "./content.service";

export function sanitizeContent(content: ContentRecord): Omit<ContentRecord, "filePath"> {
  const { filePath: _filePath, ...safeContent } = content;
  return safeContent;
}

export class ContentController {
  constructor(private readonly service: ContentService) {}

  create = async (req: AuthGuard.AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const content = await this.service.createContent(req.user!.userId, req.body, req.file!);
      ResponseUtil.created(res, sanitizeContent(content), "Content uploaded");
    } catch (error) {
      next(error);
    }
  };

  listMine = async (
    req: AuthGuard.AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const result = await this.service.listTeacherContent(req.user!.userId, req.query);
      ResponseUtil.success(res, result.items.map(sanitizeContent), "Content fetched", 200, {
        total: result.total,
      });
    } catch (error) {
      next(error);
    }
  };

  listAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.service.listAllContent(req.query);
      ResponseUtil.success(res, result.items.map(sanitizeContent), "Content fetched", 200, {
        total: result.total,
      });
    } catch (error) {
      next(error);
    }
  };
}
