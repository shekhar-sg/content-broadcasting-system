import { Router } from "express";
import { AuthGuard } from "../../common/guards/auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { UploadMiddleware } from "../../common/middleware/upload.middleware";
import { ContentController } from "./content.controller";
import type { ContentService } from "./content.service";

export function createContentRouter(service: ContentService): Router {
  const controller = new ContentController(service);
  const router = Router();

  router.use(AuthGuard.authenticate);
  router.post("/", RolesGuard.authorize("teacher"), UploadMiddleware.single, controller.create);
  router.get("/mine", RolesGuard.authorize("teacher"), controller.listMine);
  router.get("/", RolesGuard.authorize("principal"), controller.listAll);

  return router;
}
