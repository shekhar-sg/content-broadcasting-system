export interface LiveContentItem {
  id: string;
  title: string;
  subject: string;
  rotationOrder: number;
  rotationDuration: number;
  startTime: Date | null;
  endTime: Date | null;
  description?: string | null;
  fileUrl?: string | null;
  teacherId?: string;
}

export interface BroadcastRepository {
  findApprovedLiveContent(teacherId: string, subject?: string): Promise<LiveContentItem[]>;
}
