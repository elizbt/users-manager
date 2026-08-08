import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
	plugins: [tailwindcss(), react()],
	build: {
		outDir: "dist/client",
	},
	test: {
		environment: "jsdom",
		css: true,
		setupFiles: "./client/src/test/setup.ts",
	},
});
