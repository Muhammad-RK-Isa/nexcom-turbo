import { defineConfig } from "drizzle-kit";

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) throw new Error("Missing DATABASE_URL");

export default defineConfig({
  dialect: "postgresql",
  out: "drizzle",
  dbCredentials: {
    url: DATABASE_URL,
  },
  schema: "src/schema/index.ts",
  casing: "snake_case",
});
