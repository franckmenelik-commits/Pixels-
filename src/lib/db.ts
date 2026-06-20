import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import { createClient } from "@libsql/client";
import path from "node:path";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

function createPrismaClient() {
  const dbPath = path.join(process.cwd(), "prisma", "dev.db");
  const libsql = createClient({ url: `file:${dbPath}` });
  const adapter = new PrismaLibSql(libsql as never);
  return new PrismaClient({ adapter } as never);
}

export const prisma = globalForPrisma.prisma || createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
