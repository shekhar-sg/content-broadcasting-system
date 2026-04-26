import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../generated/prisma/client";

export namespace Database {
  export class Service extends PrismaClient {
    constructor() {
      const adapter = new PrismaPg({
        connectionString: process.env.DATABASE_URL ?? "",
      });
      super({
        adapter,
        log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
      });
    }
  }

  let instance: Service | null = null;

  export function getInstance(): Service {
    if (!instance) {
      instance = new Service();
    }
    return instance;
  }
}
