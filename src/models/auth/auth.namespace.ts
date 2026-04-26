import type {
  Role as AuthRole,
  UserRecord as AuthUserRecord,
  UserRepository as AuthUserRepository,
} from "./auth.contracts";
import { AuthController, sanitizeUser as sanitizeAuthUser } from "./auth.controller";
import { createAuthRouter } from "./auth.router";
import {
  type LoginInput as AuthLoginInput,
  type RegisterTeacherInput as AuthRegisterTeacherInput,
  AuthSchemas,
} from "./auth.schemas";
import { AuthService } from "./auth.service";

export namespace AuthModule {
  export type Role = AuthRole;
  export type UserRecord = AuthUserRecord;
  export type UserRepository = AuthUserRepository;
  export type RegisterTeacherInput = AuthRegisterTeacherInput;
  export type LoginInput = AuthLoginInput;

  export const Schemas = AuthSchemas;
  export class Service extends AuthService {}
  export class Controller extends AuthController {}
  export const sanitizeUser = sanitizeAuthUser;
  export const createRouter = createAuthRouter;
}
