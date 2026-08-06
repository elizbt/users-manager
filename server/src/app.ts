import cors from "@fastify/cors";
import Fastify from "fastify";

export function buildApp() {
  const app = Fastify({
    logger: true
  });

  app.register(cors);

  return app;
}
