import { Router } from "express";
import { AuthGuard } from "../../common/guards/auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { AnalyticsController } from "./analytics.controller";
import type { AnalyticsService } from "./analytics.service";

export function createAnalyticsRouter(service: AnalyticsService): Router {
  const controller = new AnalyticsController(service);
  const router = Router();

  router.use(AuthGuard.authenticate);
  router.use(RolesGuard.authorize("principal"));
  router.get("/subjects", controller.subjects);
  router.get("/subjects/most-active", controller.mostActive);
  router.get("/teachers", controller.teachers);

  return router;
}
