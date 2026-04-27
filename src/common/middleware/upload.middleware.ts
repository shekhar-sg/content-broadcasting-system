import path from "node:path";
import type { Request } from "express";
import multer, { type FileFilterCallback } from "multer";
import { cloudinaryStorage } from "../../config/cloudinary.config";
import { Config } from "../../config/config.service";
import { Constants } from "../utils/constants.util";

export namespace UploadMiddleware {
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
    storage: cloudinaryStorage,
    fileFilter,
    limits: { fileSize: Config.Service.maxFileSize },
  }).single("file");
}




