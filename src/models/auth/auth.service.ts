import argon2 from "argon2";
import { z } from "zod";
import { HttpError } from "../../common/utils/http.error";
import type { UserRecord, UserRepository } from "./auth.contracts";
import { AuthSchemas, type RegisterTeacherInput } from "./auth.schemas";

export class AuthService {
  constructor(private readonly users: UserRepository) {}

  async registerTeacher(input: RegisterTeacherInput): Promise<{ user: UserRecord }> {
    const payload = AuthSchemas.registerTeacher.safeParse(input);
    if (!payload.success) {
      throw HttpError.validationError(
        "Validation error",
        z.flattenError(payload.error).fieldErrors
      );
    }
    const existingUser = await this.users.findByEmail(payload.data.email);
    if (existingUser) {
      throw HttpError.conflict("A user with this email already exists");
    }

    const passwordHash = await argon2.hash(payload.data.password);

    const user = await this.users.create({
      name: payload.data.name,
      email: payload.data.email,
      passwordHash,
      role: "TEACHER",
    });

    return user ? { user } : Promise.reject(new Error("Failed to create user"));
  }
}
