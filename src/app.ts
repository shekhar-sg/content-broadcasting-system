import cors from "cors";
import express, { type Express } from "express";
import { AuthModule } from "./models/auth/auth.namespace";

export interface AppServices {
  authService?: AuthModule.Service;
}

export function createApp(services: AppServices = {}): Express {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.get("/health", (_req, res) => {
    res.status(200).json({ success: true, message: "Healthy" });
  });

  if (services.authService) {
    app.use("/api/auth", AuthModule.createRouter(services.authService));
  }

  return app;
}
