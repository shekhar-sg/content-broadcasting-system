import type { Request, Response } from "express";
import { getApp } from "../src/server";

export default async function handler(req: Request, res: Response): Promise<void> {
  const app = await getApp();
  app(req, res);
}

