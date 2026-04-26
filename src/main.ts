import { createApp } from "./app";
import { Config } from "./config/config.service";
import { AuthModule } from "./models/auth/auth.namespace";
import { UserRepository } from "./models/auth/auth.repository";
import { Database } from "./prisma/prisma.service";

async function bootstrap(): Promise<void> {
  const prisma = Database.getInstance();
  await prisma.$connect();

  const userRepository = new UserRepository(prisma);

  const app = createApp({
    authService: new AuthModule.Service(userRepository),
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
