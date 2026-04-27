import type {
  ApprovalRecord as ModuleApprovalRecord,
  ApprovalRepository as ModuleApprovalRepository,
  ApprovalStatus as ModuleApprovalStatus,
} from "./approval.contracts";
import { ApprovalController } from "./approval.controller";
import { createApprovalRouter } from "./approval.router";
import { ApprovalSchemas } from "./approval.schemas";
import { ApprovalService } from "./approval.service";

export namespace ApprovalModule {
  export type ApprovalStatus = ModuleApprovalStatus;
  export type ApprovalRecord = ModuleApprovalRecord;
  export type Repository = ModuleApprovalRepository;

  export const Schemas = ApprovalSchemas;
  export class Service extends ApprovalService {}
  export class Controller extends ApprovalController {}
  export const createRouter = createApprovalRouter;
}
