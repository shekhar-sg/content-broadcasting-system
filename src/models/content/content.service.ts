import "multer";
import { HttpError } from "../../common/utils/http.error";
import type { ContentRecord, ContentRepository, ListResult } from "./content.contracts";
import { ContentSchemas } from "./content.schemas";

export class ContentService {
  constructor(private readonly content: ContentRepository) {}

  async createContent(
    teacherId: string,
    body: unknown,
    file: Express.Multer.File
  ): Promise<ContentRecord> {
    if (!file) {
      throw HttpError.badRequest("File is required");
    }

    const payload = ContentSchemas.create.parse(body);

    return this.content.create({
      title: payload.title,
      description: payload.description ?? null,
      subject: payload.subject,
      filePath: file.path,
      fileType: file.mimetype,
      fileSize: file.size,
      uploadedBy: teacherId,
      status: "pending",
      startTime: payload.startTime ? new Date(payload.startTime) : null,
      endTime: payload.endTime ? new Date(payload.endTime) : null,
      rotationDuration: payload.rotationDuration,
    });
  }

  async listTeacherContent(teacherId: string, query: unknown): Promise<ListResult> {
    const filters = ContentSchemas.listQuery.parse(query);
    return this.content.findByTeacher(teacherId, filters);
  }

  async listAllContent(query: unknown): Promise<ListResult> {
    const filters = ContentSchemas.listQuery.parse(query);
    return this.content.findAll(filters);
  }
}
