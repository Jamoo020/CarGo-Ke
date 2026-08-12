import "dotenv/config";
import { defineConfig } from "prisma";

export default defineConfig({
  schemaPath: "./prisma/schema.prisma",
  datasource: {
    url: process.env.DATABASE_URL,
  },
});
