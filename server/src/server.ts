import { buildApp } from "./app.js";

const app = buildApp();
const port = Number(process.env.PORT) || 3000;

try {
  await app.listen({ port });
} catch (error) {
  app.log.error(error);
  process.exit(1);
}
