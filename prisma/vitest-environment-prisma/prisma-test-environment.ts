import "dotenv/config";
import { randomUUID } from "node:crypto";
import { execSync } from "node:child_process";
import { PrismaClient } from "@prisma/client";
import type { Environment } from "vitest";

//'postgresql://docker:docker@tlocalhos:5432/nodestage3?schema=public'

const prisma = new PrismaClient();

function generateDataBaseUrl(schema: string) {
  if (!process.env.DATABASE_URL) {
    throw new Error("Please provide DATABASE_URL enviroment variable.");
  }
  const url = new URL(process.env.DATABASE_URL);
  url.searchParams.set("schema", schema);
  return url.toString();
}

export default <Environment>{
  name: "custom",
  transformMode: "ssr",
  async setup() {
    const schema = randomUUID();
    const dataBaseUrl = generateDataBaseUrl(schema);
    process.env.DATABASE_URL = dataBaseUrl;
    execSync("npx prisma migrate deploy");

    return {
      async teardown() {
        await prisma.$executeRawUnsafe(
          `DROP SCHEMA IF EXISTS "${schema}" CASCADE`
        );
        await prisma.$disconnect();
      },
    };
  },
};
