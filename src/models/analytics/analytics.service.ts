import type { AnalyticsRepository, SubjectSummary, TeacherSummary } from "./analytics.contract";

export class AnalyticsService {
  constructor(private readonly repository: AnalyticsRepository) {}

  async getSubjectSummary(): Promise<SubjectSummary[]> {
    return this.repository.getSubjectSummary();
  }

  async getMostActiveSubject(): Promise<SubjectSummary | null> {
    const items = await this.repository.getSubjectSummary();
    return items.sort((left, right) => right.approvedCount - left.approvedCount)[0] ?? null;
  }

  async getTeacherSummary(): Promise<TeacherSummary[]> {
    return this.repository.getTeacherSummary();
  }
}
