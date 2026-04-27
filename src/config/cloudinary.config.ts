import type { Request } from "express";
import type { StorageEngine } from "multer";
import { v2 as cloudinary } from "cloudinary";
import { Config } from "./config.service";

cloudinary.config({
  cloud_name: Config.Service.cloudinaryCloudName,
  api_key: Config.Service.cloudinaryApiKey,
  api_secret: Config.Service.cloudinaryApiSecret,
  secure: true,
});

class CloudinaryStorageEngine implements StorageEngine {
  _handleFile(
    _req: Request,
    file: Express.Multer.File,
    cb: (error?: Error | null, info?: Partial<Express.Multer.File>) => void
  ): void {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: Config.Service.cloudinaryFolder,
        resource_type: "image",
        allowed_formats: ["jpg", "jpeg", "png", "gif"],
      },
      (error, result) => {
        if (error || !result) {
          cb(error ?? new Error("Cloudinary upload failed"));
          return;
        }

        cb(null, {
          path: result.secure_url,
          filename: result.public_id,
          size: result.bytes,
        });
      }
    );

    file.stream.pipe(uploadStream);
  }

  _removeFile(
    _req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null) => void
  ): void {
    cloudinary.uploader.destroy(file.filename, { resource_type: "image" }, (error) => {
      cb(error ?? null);
    });
  }
}

export const cloudinaryStorage = new CloudinaryStorageEngine();

export async function deleteFromCloudinary(publicId: string): Promise<void> {
  await cloudinary.uploader.destroy(publicId, { resource_type: "image" });
}





