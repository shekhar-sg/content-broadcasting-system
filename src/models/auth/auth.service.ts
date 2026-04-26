import argon2 from "argon2";
import { HttpError } from "../../common/utils/http.error";
import { JWT } from "../../common/utils/jwt.util";
import type { UserRecord, UserRepository } from "./auth.contracts";
import type { LoginInput, RegisterTeacherInput } from "./auth.schemas";

export class AuthService {
  constructor(private readonly users: UserRepository) {}

  async registerTeacher(input: RegisterTeacherInput): Promise<{ user: UserRecord }> {
    const existingUser = await this.users.findByEmail(input.email);
    if (existingUser) {
      throw HttpError.conflict("A user with this email already exists");
    }

    const passwordHash = await argon2.hash(input.password);

    const user = await this.users.create({
      name: input.name,
      email: input.email,
      passwordHash,
      role: "TEACHER",
    });

    return { user };
  }

  async login(input: LoginInput): Promise<{ token: string; user: UserRecord }> {
    const user = await this.users.findByEmail(input.email);
    if (!user) {
      throw HttpError.unauthorized("Invalid email or password");
    }

    const validPassword = await argon2.verify(user.passwordHash, input.password);
    if (!validPassword) {
      throw HttpError.unauthorized("Invalid password");
    }

    const token = JWT.sign({
      userId: user.id,
      role: user.role,
      email: user.email,
    });

    return { token, user };
  }
}
