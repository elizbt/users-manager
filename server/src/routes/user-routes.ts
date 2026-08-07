import type { FastifyPluginAsync } from "fastify";
import {
	editUserName,
	listUsers,
	removeUser,
} from "../controllers/user-controller.js";

export const userRoutes: FastifyPluginAsync = async (app) => {
	app.get("/", listUsers);
	app.patch("/:id", editUserName);
	app.delete("/:id", removeUser);
};
