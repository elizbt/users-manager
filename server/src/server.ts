import { buildApp } from "./app.js";
import { prisma } from "./database.js";

const app = buildApp();
const port = Number(process.env.PORT) || 3000;

async function startServer(): Promise<void> {
	try {
		await prisma.user.count();
		app.addHook("onClose", async () => {
			await prisma.$disconnect();
		});
		await app.listen({ port });
	} catch (error) {
		app.log.error(error, "Failed to start application");
		process.exit(1);
	}
}

void startServer();
