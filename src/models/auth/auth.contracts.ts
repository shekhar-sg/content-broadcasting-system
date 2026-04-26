export type Role = "PRINCIPAL" | "TEACHER";

export interface UserRecord {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: Role;
  createdAt: Date;
}

export interface UserRepository {
  findByEmail(email: string): Promise<UserRecord | null>;
  create(input: {
    name: string;
    email: string;
    passwordHash: string;
    role: Role;
  }): Promise<UserRecord>;
}
