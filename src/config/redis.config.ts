import Redis from "ioredis";
import { Config } from "./config.service";

export namespace RedisConfig {
  let _client: Redis | null = null;
  let _initialized = false;

  function getClient(): Redis | null {
    if (_initialized) return _client;
    _initialized = true;

    try {
      const client = new Redis(Config.Service.redisUrl, {
        enableOfflineQueue: false,
        maxRetriesPerRequest: 0,
        connectTimeout: 2000,
        lazyConnect: true,
      });

      client.on("error", () => {
        _client = null;
      });

      client
        .connect()
        .then(() => {
          _client = client;
        })
        .catch(() => {
          _client = null;
        });

      return client;
    } catch {
      return null;
    }
  }

  export async function get(key: string): Promise<string | null> {
    const client = getClient();
    if (!client) return null;
    try {
      return await client.get(key);
    } catch {
      return null;
    }
  }

  export async function set(key: string, value: string, ttlSeconds: number): Promise<void> {
    const client = getClient();
    if (!client) return;
    try {
      await client.set(key, value, "EX", ttlSeconds);
    } catch {
      console.log(`Failed to set Redis key: ${key}`);
    }
  }

  export async function delPattern(pattern: string): Promise<void> {
    const client = getClient();
    if (!client) return;
    try {
      const keys = await client.keys(pattern);
      if (keys.length > 0) await client.del(...keys);
    } catch {
      console.log(`Failed to delete Redis key: ${pattern}`);
    }
  }
}
