import { Router } from "express";
import { AuthGuard } from "../../common/guards/auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { ApprovalController } from "./approval.controller";
import type { ApprovalService } from "./approval.service";

export function createApprovalRouter(service: ApprovalService): Router {
  const controller = new ApprovalController(service);
  const router = Router();

  router.use(AuthGuard.authenticate);
  router.use(RolesGuard.authorize("principal"));
  router.get("/pending", controller.listPending);
  router.patch("/:contentId/approve", controller.approve);
  router.patch("/:contentId/reject", controller.reject);

  return router;
}
