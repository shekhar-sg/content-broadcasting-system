import type { Request, Response } from "express";
import bootstrap from "../src/main";

let appPromise: ReturnType<typeof bootstrap>;

async function handler(req: Request, res: Response) {
  try {
    if (!appPromise) {
      appPromise = bootstrap();
    }
    const app = await appPromise;
    app(req, res);
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

export default handler;
