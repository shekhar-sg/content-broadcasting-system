import type { NextFunction, Request, Response } from "express";
import { z } from "zod";
import type { AuthGuard } from "../../common/guards/auth.guard";
import { HttpError } from "../../common/utils/http.error";
import { ResponseUtil } from "../../common/utils/response.util";
import type { ContentRecord } from "./content.contracts";
import { ContentSchemas } from "./content.schemas";
import type { ContentService } from "./content.service";

export function sanitizeContent(content: ContentRecord): Omit<ContentRecord, "filePath"> {
  const { filePath: _filePath, ...safeContent } = content;
  return safeContent;
}

export class ContentController {
  constructor(private readonly service: ContentService) {}

  create = async (req: AuthGuard.AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    if (!req.file) {
      next(HttpError.badRequest("File is required"));
      return;
    }

    const body = ContentSchemas.create.safeParse(req.body);
    if (!body.success) {
      next(HttpError.validationError("Validation error", z.flattenError(body.error).fieldErrors));
      return;
    }

    try {
      const content = await this.service.createContent(req.user!.userId, body.data, req.file);
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
    const query = ContentSchemas.listQuery.safeParse(req.query);
    if (!query.success) {
      next(HttpError.validationError("Validation error", z.flattenError(query.error).fieldErrors));
      return;
    }

    try {
      const result = await this.service.listTeacherContent(req.user!.userId, query.data);
      ResponseUtil.success(res, result.items.map(sanitizeContent), "Content fetched", 200, {
        total: result.total,
      });
    } catch (error) {
      next(error);
    }
  };

  listAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const query = ContentSchemas.listQuery.safeParse(req.query);
    if (!query.success) {
      next(HttpError.validationError("Validation error", z.flattenError(query.error).fieldErrors));
      return;
    }

    try {
      const result = await this.service.listAllContent(query.data);
      ResponseUtil.success(res, result.items.map(sanitizeContent), "Content fetched", 200, {
        total: result.total,
      });
    } catch (error) {
      next(error);
    }
  };
}


