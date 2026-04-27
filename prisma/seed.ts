import "dotenv/config";
import argon2 from "argon2";
import type { Role } from "../generated/prisma/client";
import { Database } from "../src/prisma/prisma.service";

async function upsertUser(input: {
  email: string;
  name: string;
  password: string;
  role: Role;
}): Promise<void> {
  const prisma = Database.getInstance();
  const passwordHash = await argon2.hash(input.password);

  await prisma.user.upsert({
    where: {
      email: input.email,
    },
    update: {
      name: input.name,
      passwordHash,
      role: input.role,
    },
    create: {
      name: input.name,
      email: input.email,
      passwordHash,
      role: input.role,
    },
  });
}

async function main(): Promise<void> {
  const prisma = Database.getInstance();
  await prisma.$connect();

  await upsertUser({
    name: process.env.PRINCIPAL_NAME ?? "Principal Admin",
    email: process.env.PRINCIPAL_EMAIL ?? "principal@school.edu",
    password: process.env.PRINCIPAL_PASSWORD ?? "Admin@1234",
    role: "PRINCIPAL",
  });

  await upsertUser({
    name: process.env.DEMO_TEACHER_NAME ?? "Demo Teacher",
    email: process.env.DEMO_TEACHER_EMAIL ?? "teacher1@school.edu",
    password: process.env.DEMO_TEACHER_PASSWORD ?? "Teacher@123",
    role: "TEACHER",
  });

  await prisma.$disconnect();
  console.log("Seed completed successfully");
}

main().catch(async (error) => {
  console.error("Seed failed:", error);
  await Database.getInstance().$disconnect();
  process.exit(1);
});
