import path from "node:path";
import cors from "cors";
import express, { type Express } from "express";
import { HttpExceptionFilter } from "./common/filters/http-exception.filter";
import { Config } from "./config/config.service";
import { AnalyticsModule } from "./models/analytics/analytics.namespace";
import { ApprovalModule } from "./models/approval/approval.namespace";
import { AuthModule } from "./models/auth/auth.namespace";
import { BroadcastModule } from "./models/broadcast/broadcast.namespace";
import { ContentModule } from "./models/content/content.namespace";

export interface AppServices {
  authService?: AuthModule.Service;
  contentService?: ContentModule.Service;
  approvalService?: ApprovalModule.Service;
  broadcastService?: BroadcastModule.Service;
  analyticsService?: AnalyticsModule.Service;
}

export function createApp(services: AppServices = {}): Express {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use("./uploads", express.static(path.resolve(Config.Service.uploadDir)));

  app.get("/", (_req, res) => {
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
    app.use("api/content", BroadcastModule.createRouter(services.broadcastService));
  }

  if (services.analyticsService) {
    app.use("/api/analytics", AnalyticsModule.createRouter(services.analyticsService));
  }

  app.use(HttpExceptionFilter.handle);

  return app;
}
