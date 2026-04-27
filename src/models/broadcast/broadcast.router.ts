import { Router } from "express";
import { RateLimiter } from "../../common/middleware/rate-limiter.middleware";
import { BroadcastController } from "./broadcast.controller";
import type { BroadcastService } from "./broadcast.service";

export function createBroadcastRouter(service: BroadcastService): Router {
  const controller = new BroadcastController(service);
  const router = Router();

  router.get("/live/:teacherId", RateLimiter.broadcast, controller.getLive);

  return router;
}
