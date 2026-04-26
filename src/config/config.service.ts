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
      return this.get("JwtSecret");
    }

    static get jwtExpiry(): string {
      return this.get("JwtExpiresIn", "15m");
    }
  }
}
