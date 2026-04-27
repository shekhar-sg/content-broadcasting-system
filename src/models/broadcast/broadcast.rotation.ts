import type { LiveContentItem } from "./broadcast.contract";

export class BroadcastRotationService {
  static pickActiveContent(
    items: LiveContentItem[],
    now: Date = new Date()
  ): LiveContentItem | null {
    const eligibleItems = items
      .filter((item) => {
        if (!item.startTime || !item.endTime) {
          return false;
        }

        return item.startTime <= now && now < item.endTime;
      })
      .sort((left, right) => left.rotationOrder - right.rotationOrder);

    if (eligibleItems.length === 0) {
      return null;
    }

    const totalCycleSeconds = eligibleItems.reduce(
      (sum, item) => sum + item.rotationDuration * 60,
      0
    );

    if (totalCycleSeconds <= 0) {
      return null;
    }

    const midnightUtc = Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate(),
      0,
      0,
      0,
      0
    );
    const secondsSinceMidnight = Math.floor((now.getTime() - midnightUtc) / 1000);
    const position = secondsSinceMidnight % totalCycleSeconds;

    let cursor = 0;
    for (const item of eligibleItems) {
      cursor += item.rotationDuration * 60;
      if (position < cursor) {
        return item;
      }
    }

    return eligibleItems[0] ?? null;
  }
}
