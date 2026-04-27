import type { Request, Response } from "express";
import { getApp } from "../src/server";

export default async function handler(req: Request, res: Response): Promise<void> {
  try {
    const app = await getApp();
    app(req, res);
  } catch (error) {
    console.error("Failed to initialize handler", error);
    res.status(500).json({
      success: false,
      message: "Server initialization failed",
    });
  }
}

