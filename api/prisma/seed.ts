import { getDatabaseUrl } from "../src/utils/prismaHelper";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import dotenv from "dotenv";
import { seedTest } from "./seed.test";
import { seedDev } from "./seed.dev";

dotenv.config();

const databaseUrl = getDatabaseUrl();

if (databaseUrl) {
	process.env.DATABASE_URL = databaseUrl;
} else {
	throw new Error(
		"DATABASE_URL not found. Check your .env file and MODE variable.",
	);
}



async function main() {
  const mode = process.env.MODE ?? "dev";
  console.log(`[seed] MODE=${mode}`);

  if (mode === "test") {
    await seedTest(prisma);
  } else {
    await seedDev(prisma);
  }
}

main()
	.then(() => {
		console.log("Datos insertados correctamente");
		prisma.$disconnect();
	})
	.catch((e) => {
		console.error(e);
		prisma.$disconnect();
		process.exit(1);
	});
