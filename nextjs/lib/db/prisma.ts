import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

function createClient() {
  // pg doesn't understand Prisma's ?schema= parameter — strip it and pass explicitly
  const rawUrl = process.env.DATABASE_URL ?? "";
  const url = new URL(rawUrl);
  const schema = url.searchParams.get("schema") ?? "public";
  url.searchParams.delete("schema");

  const pool = new Pool({ connectionString: url.toString() });
  const adapter = new PrismaPg(pool, { schema });
  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? createClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
