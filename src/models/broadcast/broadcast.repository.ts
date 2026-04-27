import type { PrismaClient } from "../../../generated/prisma/client";
import type { BroadcastModule } from "./broadcast.namespace";

export class BroadcastRepository implements BroadcastModule.BroadcastRepository {
  constructor(private readonly prisma: PrismaClient) {}

  private mapToLiveContent(schedule: any, teacherId: string): BroadcastModule.LiveContentItem {
    const { rotationOrder, content } = schedule;

    return {
      id: content.id,
      title: content.title,
      subject: content.subject,
      teacherId,
      rotationOrder,
      rotationDuration: content.rotationDuration,
      startTime: content.startTime,
      endTime: content.endTime,
      description: content.description,
      fileUrl: content.filePath,
    };
  }

  async findApprovedLiveContent(
    teacherId: string,
    subject?: string
  ): Promise<BroadcastModule.LiveContentItem[]> {
    const schedules = await this.prisma.contentSchedule.findMany({
      where: {
        slot: {
          teacherId,
          ...(subject ? { subject } : {}),
        },
        content: {
          status: "APPROVED",
        },
      },
      orderBy: {
        rotationOrder: "asc",
      },
      include: {
        content: true,
      },
    });

    return schedules.map((s) => this.mapToLiveContent(s, teacherId));
  }
}
