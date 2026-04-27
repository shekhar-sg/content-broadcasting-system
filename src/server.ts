import "dotenv/config";
import type { Express } from "express";
import { createApp } from "./create-app";
import { AnalyticsModule } from "./models/analytics/analytics.namespace";
import { AnalyticsRepository } from "./models/analytics/analytics.repository";
import { ApprovalModule } from "./models/approval/approval.namespace";
import { ApprovalRepository } from "./models/approval/approval.repository";
import { AuthModule } from "./models/auth/auth.namespace";
import { UserRepository } from "./models/auth/auth.repository";
import { BroadcastModule } from "./models/broadcast/broadcast.namespace";
import { BroadcastRepository } from "./models/broadcast/broadcast.repository";
import { ContentModule } from "./models/content/content.namespace";
import { ContentRepository } from "./models/content/content.repository";
import { Database } from "./prisma/prisma.service";

let appPromise: Promise<Express> | null = null;

export async function getApp(): Promise<Express> {
  if (!appPromise) {
    appPromise = Promise.resolve().then(() => {
      const prisma = Database.getInstance();

      const userRepository = new UserRepository(prisma);
      const contentRepository = new ContentRepository(prisma);
      const approvalRepository = new ApprovalRepository(prisma);
      const broadcastRepository = new BroadcastRepository(prisma);
      const analyticsRepository = new AnalyticsRepository(prisma);

      const broadcastService = new BroadcastModule.Service(broadcastRepository);

      return createApp({
        authService: new AuthModule.Service(userRepository),
        contentService: new ContentModule.Service(contentRepository),
        approvalService: new ApprovalModule.Service(approvalRepository, async (record) => {
          if (record.uploadedBy) {
            await broadcastService.invalidateTeacherCache(record.uploadedBy);
          }
        }),
        broadcastService,
        analyticsService: new AnalyticsModule.Service(analyticsRepository),
      });
    });
  }

  return appPromise;
}

const app = getApp();

export default app;

export async function disconnectAppDependencies(): Promise<void> {
  await Database.disconnect();
}

