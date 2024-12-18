import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./apps/server/src/db/schema.ts",   // Schéma Drizzle
  out: "./apps/server/migrations",           // Où stocker les migrations
  driver: "pg",
  dbCredentials: {
    connectionString: process.env.DATABASE_URL!, // URL BDD dans .env
  },
});
