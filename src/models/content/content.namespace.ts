import type {
  ContentRecord as ModuleContentRecord,
  ContentRepository as ModuleContentRepository,
  ContentStatus as ModuleContentStatus,
  ListQueryInput as ModuleListQueryInput,
  ListResult as ModuleListResult,
} from "./content.contracts";
import { ContentController, sanitizeContent as sanitizeContentRecord } from "./content.controller";
import { createContentRouter } from "./content.router";
import type { CreateContentInput as ModuleCreateContentInput } from "./content.schemas";
import { ContentSchemas } from "./content.schemas";
import { ContentService } from "./content.service";

export namespace ContentModule {
  export type CreateContentInput = ModuleCreateContentInput;
  export type ListQueryInput = ModuleListQueryInput;
  export type ListResult = ModuleListResult;
  export type ContentStatus = ModuleContentStatus;
  export type ContentRecord = ModuleContentRecord;
  export type ContentRepository = ModuleContentRepository;

  export const Schemas = ContentSchemas;
  export class Service extends ContentService {}
  export class Controller extends ContentController {}
  export const sanitizeContent = sanitizeContentRecord;
  export const createRouter = createContentRouter;
}
