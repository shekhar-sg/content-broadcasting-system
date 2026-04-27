import type { NextFunction, Request, Response } from "express";
import { ResponseUtil } from "../../common/utils/response.util";
import type { AnalyticsService } from "./analytics.service";

export class AnalyticsController {
  constructor(private readonly service: AnalyticsService) {}

  subjects = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const items = await this.service.getSubjectSummary();
      ResponseUtil.success(res, items, "Subject analytics fetched");
    } catch (error) {
      next(error);
    }
  };

  mostActive = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const item = await this.service.getMostActiveSubject();
      ResponseUtil.success(res, item, "Most active subject fetched");
    } catch (error) {
      next(error);
    }
  };

  teachers = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const items = await this.service.getTeacherSummary();
      ResponseUtil.success(res, items, "Teacher analytics fetched");
    } catch (error) {
      next(error);
    }
  };
}
