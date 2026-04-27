import crypto from "node:crypto";
import path from "node:path";
import type { Request } from "express";
import multer, { type FileFilterCallback } from "multer";
import { Config } from "../../config/config.service";
import { Constants } from "../utils/constants.util";

export namespace UploadMiddleware {
  const storage = multer.diskStorage({
    destination: (_req, _file, cb) => {
      const uploadDir = Config.Service.uploadDir;
      cb(null, uploadDir);
    },
    filename: (_req, file, cb) => {
      const ext = path.extname(file.originalname).toLowerCase();
      const unique = `${Date.now()}-${crypto.randomBytes(6).toString("hex")}${ext}`;
      cb(null, unique);
    },
  });

  function fileFilter(_req: Request, file: Express.Multer.File, cb: FileFilterCallback): void {
    const ext = path.extname(file.originalname).toLowerCase();
    const mimeOk = (Constants.ALLOWED_MIME_TYPES as readonly string[]).includes(file.mimetype);
    const extOk = (Constants.ALLOWED_EXTENSIONS as readonly string[]).includes(ext);

    if (mimeOk && extOk) {
      cb(null, true);
    } else {
      cb(new Error("Only JPG, PNG, and GIF files are allowed"));
    }
  }

  export const single = multer({
    storage,
    fileFilter,
    limits: { fieldSize: Constants.MAX_FILE_SIZE },
  }).single("file");
}
