export type ApprovalStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface ApprovalRecord {
  id: string;
  title: string;
  status: ApprovalStatus;
  uploadedBy?: string;
  rejectionReason: string | null;
  approvedBy: string | null;
  approvedAt: Date | null;
}

export interface ApprovalRepository {
  findById(id: string): Promise<ApprovalRecord | null>;
  listPending(): Promise<ApprovalRecord[]>;
  approve(input: {
    contentId: string;
    principalId: string;
    approvedAt: Date;
  }): Promise<ApprovalRecord>;
  reject(input: { contentId: string; reason: string }): Promise<ApprovalRecord>;
}
