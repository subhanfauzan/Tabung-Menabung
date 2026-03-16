import { PrismaClient } from "@prisma/client";

// Instantiate Prisma Client
export const prisma = new PrismaClient();

// Handle shutdown
process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit(0);
});
