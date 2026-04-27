import { Config } from "./config/config.service";
import { Database } from "./prisma/prisma.service";
import app, { disconnectAppDependencies } from "./server";

async function bootstrap() {
  await Database.getInstance().$connect();

  const server = (await app).listen(Config.Service.port, () => {
    console.log(`Server is running on http://localhost:${Config.Service.port}`);
  });

  const shutdown = async (): Promise<void> => {
    server.close(async () => {
      await disconnectAppDependencies();
      process.exit(0);
    });
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
}

if (require.main === module) {
  bootstrap().catch((error: unknown) => {
    console.error("Failed to start server", error);
    void disconnectAppDependencies().finally(() => {
      process.exit(1);
    });
  });
}

export default bootstrap;
