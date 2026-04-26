import cors from "cors";
import express from "express";

export function createApp() {
  const app = express();

  app.use(cors());
  app.get("/health", (_req, res) => {
    res.status(200).json({ success: true, message: "Healthy" });
  });

  return app;
}
