import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
	schema: "prisma/schema.prisma",
	migrations: {
		path: "prisma/migrations",
		seed: "tsx server/src/scripts/seed.ts",
	},
	datasource: {
		url:
			process.env.DATABASE_URL ??
			"postgresql://users_manager:users_manager@localhost:5433/users_manager",
	},
});
