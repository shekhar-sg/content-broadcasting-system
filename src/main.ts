import { createApp } from "./app";
import { Config } from "./config/config.service";
import { AuthModule } from "./models/auth/auth.namespace";
import { UserRepository } from "./models/auth/auth.repository";
import { Database } from "./prisma/prisma.service";
import { ContentRepository } from "./models/content/content.repository";
import { ContentModule } from "./models/content/content.namespace";
import { ApprovalRepository } from './models/approval/approval.repository';
import {ApprovalModule} from "./models/approval/approval.namespace";

async function bootstrap(): Promise<void> {
  const prisma = Database.getInstance();
  await prisma.$connect();

  const userRepository = new UserRepository(prisma);
  const contentRepository = new ContentRepository(prisma);
  const approvalRepository = new ApprovalRepository(prisma);

  const app = createApp({
    authService: new AuthModule.Service(userRepository),
    contentService: new ContentModule.Service(contentRepository),
    approvalService: new ApprovalModule.Service(approvalRepository),
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

bootstrap().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});
