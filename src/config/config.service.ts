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
      return parseInt(this.get("PORT", "3000"), 10);
    }

    static get jwtSecret(): string {
      return this.get("JWT_SECRET");
    }

    static get jwtExpiry(): string {
      return this.get("JWT_EXPIRES_IN", "7d");
    }

    static get uploadDir(): string {
      return this.get("UPLOAD_DIR", "uploads");
    }

    static get maxFileSize(): number {
      return parseInt(this.get("MAX_FILE_SIZE", "10485760"), 10);
    }

    static get redisUrl(): string {
      return this.get("REDIS_URL", "redis://localhost:6379");
    }
  }
}
