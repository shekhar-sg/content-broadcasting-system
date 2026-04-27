import { HttpError } from "../../common/utils/http.error";
import type { ApprovalRecord, ApprovalRepository } from "./approval.contracts";

export class ApprovalService {
  constructor(
    private readonly repository: ApprovalRepository,
    private readonly onDecision?: (record: ApprovalRecord) => Promise<void>
  ) {}

  async listPending(): Promise<ApprovalRecord[]> {
    return this.repository.listPending();
  }

  async approveContent(contentId: string, principalId: string): Promise<ApprovalRecord> {
    const record = await this.repository.findById(contentId);
    if (!record) {
      throw HttpError.notFound("Content not found");
    }
    if (record.status !== "PENDING") {
      throw HttpError.badRequest("Only pending content can be approved");
    }

    const approved = await this.repository.approve({
      contentId,
      principalId,
      approvedAt: new Date(),
    });
    await this.onDecision?.(approved);
    return approved;
  }

  async rejectContent(contentId: string, reason: string): Promise<ApprovalRecord> {
    const record = await this.repository.findById(contentId);
    if (!record) {
      throw HttpError.notFound("Content not found");
    }
    if (record.status !== "PENDING") {
      throw HttpError.badRequest("Only pending content can be rejected");
    }

    const rejected = await this.repository.reject({ contentId, reason });
    await this.onDecision?.(rejected);
    return rejected;
  }
}
