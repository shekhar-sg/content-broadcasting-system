export interface SubjectSummary {
    subject: string;
    approvedCount: number;
    totalCount: number;
}

export interface TeacherSummary {
    teacherId: string;
    teacherName: string;
    approvedCount: number;
    totalCount: number;
}

export interface AnalyticsRepository {
    getSubjectSummary(): Promise<SubjectSummary[]>;
    getTeacherSummary(): Promise<TeacherSummary[]>;
}
