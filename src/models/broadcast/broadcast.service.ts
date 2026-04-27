import { RedisConfig } from "../../config/redis.config";
import type { BroadcastRepository, LiveContentItem } from "./broadcast.contract";
import { BroadcastRotationService } from "./broadcast.rotation";

export class BroadcastService {
  constructor(private readonly repository: BroadcastRepository) {}

  async getLiveContent(teacherId: string, subject?: string): Promise<LiveContentItem | null> {
    const cacheKey = `live:${teacherId}:${subject ?? "all"}`;
    try {
      const cached = await RedisConfig.get(cacheKey);
      if (cached) {
        return JSON.parse(cached) as LiveContentItem;
      }

      const items = await this.repository.findApprovedLiveContent(teacherId, subject);
      const activeItem = BroadcastRotationService.pickActiveContent(items);

      if (activeItem) {
        const ttl = Math.max(1, Math.min(activeItem.rotationDuration * 60, 60));
        await RedisConfig.set(cacheKey, JSON.stringify(activeItem), ttl);
      }

      return activeItem;
    } catch (error) {
      console.error("Error fetching live content:", error);
      return null;
    }
  }

  async invalidateTeacherCache(teacherId: string): Promise<void> {
    await RedisConfig.delPattern(`live:${teacherId}:*`);
  }
}
