import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    // Prefer DIRECT_URL for schema operations (migration/push)
    // Fall back to DATABASE_URL if direct isn't provided
    url: process.env.DIRECT_URL || process.env.DATABASE_URL!,
  },
});
