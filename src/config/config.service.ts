export namespace Config {
  export class Service {
    static get(key: string, fallback?: string): string {
      const value = process.env[key];
      if (!value && fallback === undefined) {
        throw new Error(`Missing configuration for key: ${key}`);
      }
      return value || fallback!;
    }

    static get port(): number {
      return parseInt(Service.get("PORT", "3000"), 10);
    }

    static get jwtSecret(): string {
      return Service.get("JWT_SECRET");
    }

    static get jwtExpiry(): string {
      return Service.get("JWT_EXPIRES_IN", "7d");
    }

    static get uploadDir(): string {
      return Service.get("UPLOAD_DIR", process.env.VERCEL ? "/tmp/uploads" : "uploads");
    }

    static get maxFileSize(): number {
      return parseInt(Service.get("MAX_FILE_SIZE", "10485760"), 10);
    }

    static get redisUrl(): string {
      return Service.get("REDIS_URL", "redis://localhost:6379");
    }

    static get cloudinaryCloudName(): string {
      return Service.get("CLOUDINARY_CLOUD_NAME");
    }

    static get cloudinaryApiKey(): string {
      return Service.get("CLOUDINARY_API_KEY");
    }

    static get cloudinaryApiSecret(): string {
      return Service.get("CLOUDINARY_API_SECRET");
    }

    static get cloudinaryFolder(): string {
      return Service.get("CLOUDINARY_FOLDER", "content-broadcasting");
    }
  }
}

