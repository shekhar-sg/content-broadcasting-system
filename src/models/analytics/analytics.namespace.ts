import type {
  AnalyticsRepository as ModuleAnalyticsRepository,
  SubjectSummary as ModuleSubjectSummary,
  TeacherSummary as ModuleTeacherSummary,
} from "./analytics.contract";
import { AnalyticsController } from "./analytics.controller";
import { createAnalyticsRouter } from "./analytics.router";
import { AnalyticsService } from "./analytics.service";

export namespace AnalyticsModule {
  export type SubjectSummary = ModuleSubjectSummary;
  export type TeacherSummary = ModuleTeacherSummary;
  export type Repository = ModuleAnalyticsRepository;

  export class Service extends AnalyticsService {}
  export class Controller extends AnalyticsController {}
  export const createRouter = createAnalyticsRouter;
}
