import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "./generated/prisma/client.js";

const connectionString =
	process.env.DATABASE_URL ??
	"postgresql://users_manager:users_manager@localhost:5433/users_manager";

const adapter = new PrismaPg({ connectionString });

export const prisma = new PrismaClient({ adapter });
