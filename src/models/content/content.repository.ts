import type { Prisma, PrismaClient } from "../../../generated/prisma/client";
import type { ContentModule } from "./content.namespace";

export class ContentRepository implements ContentModule.ContentRepository {
  constructor(private readonly prisma: PrismaClient) {}

  private mapContent(
    content: Prisma.ContentGetPayload<Record<string, never>>
  ): ContentModule.ContentRecord {
    return {
      ...content,
      status: content.status as ContentModule.ContentRecord["status"],
    };
  }

  async create(
    input: Omit<
      ContentModule.ContentRecord,
      "id" | "createdAt" | "approvedBy" | "approvedAt" | "rejectionReason"
    >
  ): Promise<ContentModule.ContentRecord> {
    return this.prisma.$transaction(async (tx) => {
      const slot = await tx.contentSlot.upsert({
        where: {
          teacherId_subject: {
            teacherId: input.uploadedBy,
            subject: input.subject,
          },
        },
        update: {},
        create: {
          teacherId: input.uploadedBy,
          subject: input.subject,
        },
      });

      const currentOrder = await tx.contentSchedule.aggregate({
        where: {
          slotId: slot.id,
        },
        _max: {
          rotationOrder: true,
        },
      });

      const content = await tx.content.create({
        data: {
          ...input,
        },
      });

      await tx.contentSchedule.create({
        data: {
          contentId: content.id,
          slotId: slot.id,
          rotationOrder: (currentOrder._max.rotationOrder ?? 0) + 1,
        },
      });

      return this.mapContent(content);
    });
  }

  async findByTeacher(
    teacherId: string,
    query: ContentModule.ListQueryInput
  ): Promise<{ items: ContentModule.ContentRecord[]; total: number }> {
    const where: Prisma.ContentWhereInput = {
      uploadedBy: teacherId,
      ...(query.subject ? { subject: query.subject } : {}),
      ...(query.status ? { status: query.status } : {}),
    };

    const [total, items] = await this.prisma.$transaction([
      this.prisma.content.count({ where }),
      this.prisma.content.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (query.page - 1) * query.limit,
        take: query.limit,
      }),
    ]);

    return {
      total,
      items: items.map(this.mapContent),
    };
  }

  async findAll(
    query: ContentModule.ListQueryInput
  ): Promise<{ items: ContentModule.ContentRecord[]; total: number }> {
    const where: Prisma.ContentWhereInput = {
      ...(query.subject ? { subject: query.subject } : {}),
      ...(query.status ? { status: query.status } : {}),
      ...(query.teacherId ? { uploadedBy: query.teacherId } : {}),
    };

    const [total, items] = await this.prisma.$transaction([
      this.prisma.content.count({ where }),
      this.prisma.content.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (query.page - 1) * query.limit,
        take: query.limit,
      }),
    ]);

    return {
      total,
      items: items.map(this.mapContent),
    };
  }
}
