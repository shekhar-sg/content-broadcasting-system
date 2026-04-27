import type { ContentStatus, PrismaClient } from "../../../generated/prisma/client";
import type { ApprovalModule } from "./approval.namespace";

export class ApprovalRepository implements ApprovalModule.Repository {
  constructor(private readonly prisma: PrismaClient) {}

  private mapApproval(content: {
    id: string;
    title: string;
    status: ContentStatus;
    uploadedBy: string;
    rejectionReason: string | null;
    approvedBy: string | null;
    approvedAt: Date | null;
  }): ApprovalModule.ApprovalRecord {
    return {
      id: content.id,
      title: content.title,
      status: content.status,
      uploadedBy: content.uploadedBy,
      rejectionReason: content.rejectionReason,
      approvedBy: content.approvedBy,
      approvedAt: content.approvedAt,
    };
  }

  async findById(id: string): Promise<ApprovalModule.ApprovalRecord | null> {
    const content = await this.prisma.content.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        status: true,
        uploadedBy: true,
        rejectionReason: true,
        approvedBy: true,
        approvedAt: true,
      },
    });

    return content ? this.mapApproval(content) : null;
  }

  async listPending(): Promise<ApprovalModule.ApprovalRecord[]> {
    const items = await this.prisma.content.findMany({
      where: { status: "PENDING" },
      orderBy: { createdAt: "asc" },
      select: {
        id: true,
        title: true,
        status: true,
        uploadedBy: true,
        rejectionReason: true,
        approvedBy: true,
        approvedAt: true,
      },
    });

    return items.map(this.mapApproval);
  }

  async approve(input: {
    contentId: string;
    principalId: string;
    approvedAt: Date;
  }): Promise<ApprovalModule.ApprovalRecord> {
    const content = await this.prisma.content.update({
      where: { id: input.contentId },
      data: {
        status: "APPROVED",
        approvedBy: input.principalId,
        approvedAt: input.approvedAt,
        rejectionReason: null,
      },
      select: {
        id: true,
        title: true,
        status: true,
        uploadedBy: true,
        rejectionReason: true,
        approvedBy: true,
        approvedAt: true,
      },
    });

    return this.mapApproval(content);
  }

  async reject(input: {
    contentId: string;
    reason: string;
  }): Promise<ApprovalModule.ApprovalRecord> {
    const content = await this.prisma.content.update({
      where: { id: input.contentId },
      data: {
        status: "REJECTED",
        rejectionReason: input.reason,
        approvedBy: null,
        approvedAt: null,
      },
      select: {
        id: true,
        title: true,
        status: true,
        uploadedBy: true,
        rejectionReason: true,
        approvedBy: true,
        approvedAt: true,
      },
    });

    return this.mapApproval(content);
  }
}
