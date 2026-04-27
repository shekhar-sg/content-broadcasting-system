import cors from "cors";
import express, { type Express } from "express";
import { ApprovalModule } from "./models/approval/approval.namespace";
import { AuthModule } from "./models/auth/auth.namespace";
import { ContentModule } from "./models/content/content.namespace";
import {BroadcastModule} from "./models/broadcast/broadcast.namespace";

export interface AppServices {
  authService?: AuthModule.Service;
  contentService?: ContentModule.Service;
  approvalService?: ApprovalModule.Service;
  broadcastService?: BroadcastModule.Service;

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

  if (services.contentService) {
    app.use("/api/content", ContentModule.createRouter(services.contentService));
  }

  if (services.approvalService) {
    app.use("/api/approval", ApprovalModule.createRouter(services.approvalService));
  }

  if (services.broadcastService) {
    app.use("/content", BroadcastModule.createRouter(services.broadcastService));
  }

  return app;
}
