import { defineConfig } from "prisma/config";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

export default defineConfig({
  schema: "./prisma/schema.prisma",
  migrations: {
    path: "./prisma/migrations",
    adapter(env) {
      const pool = new Pool({ connectionString: env.DATABASE_URL });
      return new PrismaPg(pool);
    },
  },
});
