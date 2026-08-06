import type { FastifyReply, FastifyRequest } from "fastify";
import {
	listUsersQuerySchema,
	updateUserBodySchema,
	userParamsSchema,
} from "../schemas/user-schemas.js";
import {
	deleteUser,
	findUsers,
	updateUserName,
} from "../services/user-service.js";

export async function listUsers(
	request: FastifyRequest,
	reply: FastifyReply,
): Promise<void> {
	const result = listUsersQuerySchema.safeParse(request.query);

	if (!result.success) {
		await reply.status(400).send({
			message: "Invalid query parameters",
			issues: result.error.issues,
		});

		return;
	}

	await reply.status(200).send(await findUsers(result.data));
}

export async function editUserName(
	request: FastifyRequest,
	reply: FastifyReply,
): Promise<void> {
	const paramsResult = userParamsSchema.safeParse(request.params);

	const bodyResult = updateUserBodySchema.safeParse(request.body);

	if (!paramsResult.success || !bodyResult.success) {
		await reply.status(400).send({
			message: "Invalid request data",
			issues: [
				...(paramsResult.success ? [] : paramsResult.error.issues),
				...(bodyResult.success ? [] : bodyResult.error.issues),
			],
		});

		return;
	}

	const user = await updateUserName(paramsResult.data.id, bodyResult.data.name);

	if (!user) {
		await reply.status(404).send({
			message: "User not found",
		});

		return;
	}

	await reply.status(200).send(user);
}

export async function removeUser(
	request: FastifyRequest,
	reply: FastifyReply,
): Promise<void> {
	const result = userParamsSchema.safeParse(request.params);

	if (!result.success) {
		await reply.status(400).send({
			message: "Invalid user id",
			issues: result.error.issues,
		});

		return;
	}

	const removed = await deleteUser(result.data.id);

	if (!removed) {
		await reply.status(404).send({
			message: "User not found",
		});

		return;
	}

	await reply.status(204).send();
}
