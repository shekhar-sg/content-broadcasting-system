import { createApp } from "./app";
import { Config } from "./config/config.service";

async function bootstrap(): Promise<void> {
  const app = createApp();

  app.listen(Config.Service.port, () => {
    console.log(`Server is running on http://localhost:${Config.Service.port}`);
  });
}

bootstrap().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});
