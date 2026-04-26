import type { PrismaClient, Role } from "../../../generated/prisma/client";
import type { AuthModule } from "./auth.namespace";

export class UserRepository implements AuthModule.UserRepository {
  constructor(private readonly prisma: PrismaClient) {}

  mapUser(user: {
    id: string;
    name: string;
    email: string;
    passwordHash: string;
    role: Role;
    createdAt: Date;
  }): AuthModule.UserRecord {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      passwordHash: user.passwordHash,
      role: user.role,
      createdAt: user.createdAt,
    };
  }

  async findByEmail(email: string): Promise<AuthModule.UserRecord | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    return user ? this.mapUser(user) : null;
  }

  async create(input: {
    name: string;
    email: string;
    passwordHash: string;
    role: AuthModule.Role;
  }): Promise<AuthModule.UserRecord> {
    const user = await this.prisma.user.create({
      data: {
        name: input.name,
        email: input.email,
        passwordHash: input.passwordHash,
        role: input.role,
      },
    });

    return this.mapUser(user);
  }
}
