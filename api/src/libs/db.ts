import { PrismaClient } from "@prisma/client"
import dotenv from "dotenv";
import { getDatabaseUrl } from "../utils/prismaHelper";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

dotenv.config();

process.env.DATABASE_URL = getDatabaseUrl();

export const prisma =
  globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
