import { Router } from "express";
import { AuthController } from "./auth.controller";
import type { AuthService } from "./auth.service";

export function createAuthRouter(service: AuthService): Router {
  const controller = new AuthController(service);
  const router = Router();

  router.post("/register", controller.registerTeacher);
  router.post("/login", controller.login);

  return router;
}
