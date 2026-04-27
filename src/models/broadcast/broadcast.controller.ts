import type { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { HttpError } from "../../common/utils/http.error";
import { ResponseUtil } from "../../common/utils/response.util";
import { BroadcastSchemas } from "./broadcast.schemas";
import type { BroadcastService } from "./broadcast.service";

export class BroadcastController {
  constructor(private readonly service: BroadcastService) {}

  getLive = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const params = BroadcastSchemas.params.safeParse(req.params);
    if (!params.success) {
      next(HttpError.validationError("Validation error", z.flattenError(params.error).fieldErrors));
      return;
    }

    const query = BroadcastSchemas.query.safeParse(req.query);
    if (!query.success) {
      next(HttpError.validationError("Validation error", z.flattenError(query.error).fieldErrors));
      return;
    }

    try {
      const content = await this.service.getLiveContent(params.data.teacherId, query.data.subject);

      if (!content) {
        ResponseUtil.success(res, null, "No content available");
        return;
      }

      ResponseUtil.success(res, content, "Live content fetched");
    } catch (error) {
      next(error);
    }
  };
}


