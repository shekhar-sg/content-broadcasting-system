import type {
  BroadcastRepository as ModuleBroadcastRepository,
  LiveContentItem as ModuleLiveContentItem,
} from "./broadcast.contract";
import { BroadcastController } from "./broadcast.controller";
import { BroadcastRotationService } from "./broadcast.rotation";
import { createBroadcastRouter } from "./broadcast.router";
import { BroadcastSchemas } from "./broadcast.schemas";
import { BroadcastService } from "./broadcast.service";

export namespace BroadcastModule {
  export type LiveContentItem = ModuleLiveContentItem;
  export type BroadcastRepository = ModuleBroadcastRepository;

  export const Schemas = BroadcastSchemas;
  export class RotationService extends BroadcastRotationService {}
  export class Service extends BroadcastService {}
  export class Controller extends BroadcastController {}
  export const createRouter = createBroadcastRouter;
}
