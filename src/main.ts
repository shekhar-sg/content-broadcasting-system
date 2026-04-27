import { createApp } from "./app";
import { Config } from "./config/config.service";
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

async function bootstrap() {
  const prisma = Database.getInstance();
  await prisma.$connect();

  const userRepository = new UserRepository(prisma);
  const contentRepository = new ContentRepository(prisma);
  const approvalRepository = new ApprovalRepository(prisma);
  const broadcastRepository = new BroadcastRepository(prisma);
  const analyticsRepository = new AnalyticsRepository(prisma);

  const broadcastService = new BroadcastModule.Service(broadcastRepository);

  const app = createApp({
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

  const server = app.listen(Config.Service.port, () => {
    console.log(`Server is running on http://localhost:${Config.Service.port}`);
  });

  const shutdown = async (): Promise<void> => {
    server.close(async () => {
      await prisma.$disconnect();
      process.exit(0);
    });
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
}

export default bootstrap
