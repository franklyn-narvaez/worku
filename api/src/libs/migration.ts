import { execSync } from "child_process";
import dotenv from "dotenv";
import { getDatabaseUrl } from "../utils/prismaHelper";

dotenv.config();

process.env.DATABASE_URL = getDatabaseUrl();

execSync("npx prisma migrate deploy", { stdio: "inherit", env: process.env });
