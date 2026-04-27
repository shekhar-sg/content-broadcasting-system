import "multer";
import { HttpError } from "../../common/utils/http.error";
import {
  type ContentRecord,
  type ContentRepository,
  ContentStatus,
  type ListQueryInput,
  type ListResult,
} from "./content.contracts";
import type { CreateContentInput } from "./content.schemas";

export class ContentService {
  constructor(private readonly content: ContentRepository) {}

  async createContent(
    teacherId: string,
    body: CreateContentInput,
    file: Express.Multer.File
  ): Promise<ContentRecord> {
    if (!file) {
      throw HttpError.badRequest("File is required");
    }

    return this.content.create({
      title: body.title,
      description: body.description ?? null,
      subject: body.subject,
      filePath: file.path,
      fileType: file.mimetype,
      fileSize: file.size,
      uploadedBy: teacherId,
      status: ContentStatus.PENDING,
      startTime: body.startTime ? new Date(body.startTime) : null,
      endTime: body.endTime ? new Date(body.endTime) : null,
      rotationDuration: body.rotationDuration,
    });
  }

  async listTeacherContent(teacherId: string, query: ListQueryInput): Promise<ListResult> {
    return this.content.findByTeacher(teacherId, query);
  }

  async listAllContent(query: ListQueryInput): Promise<ListResult> {
    return this.content.findAll(query);
  }
}
