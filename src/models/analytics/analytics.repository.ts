import type { PrismaClient } from "../../../generated/prisma/client";
import type { AnalyticsModule } from "./analytics.namespace";

export class AnalyticsRepository implements AnalyticsModule.Repository {
  constructor(private readonly prisma: PrismaClient) {}

  async getSubjectSummary(): Promise<AnalyticsModule.SubjectSummary[]> {
    const rows = await this.prisma.$queryRaw<
      Array<{ subject: string; approvedCount: number; totalCount: number }>
    >`
        SELECT c.subject AS subject,
               COUNT(*)     FILTER (WHERE c.status = 'APPROVED')::int AS "approvedCount", COUNT(*) ::int AS "totalCount"
        FROM content c
        GROUP BY c.subject
        ORDER BY "approvedCount" DESC, subject ASC
    `;

    return rows;
  }

  async getTeacherSummary(): Promise<AnalyticsModule.TeacherSummary[]> {
    const rows = await this.prisma.$queryRaw<
      Array<{
        teacherId: string;
        teacherName: string;
        approvedCount: number;
        totalCount: number;
      }>
    >`
        SELECT
          u.id AS "teacherId",
          u.name AS "teacherName",
          COUNT(*) FILTER (WHERE c.status = 'APPROVED')::int AS "approvedCount",
          COUNT(*)::int AS "totalCount"
        FROM users u
        LEFT JOIN content c ON c.uploaded_by = u.id
        WHERE u.role = 'teacher'
        GROUP BY u.id, u.name
        ORDER BY "approvedCount" DESC, "teacherName" ASC
      `;

    return rows;
  }
}
