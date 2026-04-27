import type { NextFunction, Request, Response } from "express";
import { ResponseUtil } from "../../common/utils/response.util";
import { BroadcastSchemas } from "./broadcast.schemas";
import type { BroadcastService } from "./broadcast.service";

export class BroadcastController {
  constructor(private readonly service: BroadcastService) {}

  getLive = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const params = BroadcastSchemas.params.parse(req.params);
      const query = BroadcastSchemas.query.parse(req.query);
      const content = await this.service.getLiveContent(params.teacherId, query.subject);

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




