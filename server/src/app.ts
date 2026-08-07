import cors from "@fastify/cors";
import Fastify from "fastify";
import { userRoutes } from "./routes/user-routes.js";

export function buildApp() {
	const app = Fastify({
		logger: true,
	});

	app.register(cors);

	app.register(userRoutes, {
		prefix: "/api/users",
	});

	app.get("/health", async () => {
		return {
			status: "ok",
		};
	});

	app.setErrorHandler((error, request, reply) => {
		request.log.error(error);

		return reply.status(500).send({
			message: "Internal server error",
		});
	});

	return app;
}
