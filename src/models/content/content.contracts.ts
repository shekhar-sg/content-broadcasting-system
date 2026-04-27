export type ContentStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface ContentRecord {
  id: string;
  title: string;
  description: string | null;
  subject: string;
  filePath: string;
  fileType: string;
  fileSize: number;
  uploadedBy: string;
  status: ContentStatus;
  rejectionReason: string | null;
  approvedBy: string | null;
  approvedAt: Date | null;
  startTime: Date | null;
  endTime: Date | null;
  rotationDuration: number;
  createdAt: Date;
}

export interface ContentRepository {
  create(
    input: Omit<ContentRecord, "id" | "createdAt" | "approvedBy" | "approvedAt" | "rejectionReason">
  ): Promise<ContentRecord>;
  findByTeacher(
    teacherId: string,
    query: ListQueryInput
  ): Promise<{ items: ContentRecord[]; total: number }>;
  findAll(query: ListQueryInput): Promise<{ items: ContentRecord[]; total: number }>;
}

export interface ListResult {
  items: ContentRecord[];
  total: number;
}

export type ListQueryInput = {
  page: number;
  limit: number;
  subject?: string | undefined;
  status?: ContentStatus | undefined;
  teacherId?: string | undefined;
};
