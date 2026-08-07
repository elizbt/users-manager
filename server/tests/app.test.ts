import type { FastifyInstance } from "fastify";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { buildApp } from "../src/app.js";
import {
	deleteUser,
	findUsers,
	updateUserName,
} from "../src/services/user-service.js";
import type { PaginatedUsers, User } from "../src/types/user.js";

vi.mock("../src/services/user-service.js", () => ({
	findUsers: vi.fn(),
	updateUserName: vi.fn(),
	deleteUser: vi.fn(),
}));

const emptyResult: PaginatedUsers = {
	data: [],
	pagination: {
		page: 1,
		limit: 10,
		totalItems: 0,
		totalPages: 0,
	},
};

const user: User = {
	id: 1,
	name: "Rick Sanchez",
	status: "Alive",
	species: "Human",
	episode: [],
	origin: {
		name: "Earth",
		url: "https://example.com/location/1",
	},
	createdAt: "2017-11-04T18:48:46.250Z",
};

let app: FastifyInstance;

beforeEach(async () => {
	vi.resetAllMocks();

	app = buildApp();
	await app.ready();
});

afterEach(async () => {
	await app.close();
});

describe("Rotas de usuários", () => {
	it("deve listar usuários e encaminhar os filtros", async () => {
		vi.mocked(findUsers).mockResolvedValue(emptyResult);

		const response = await app.inject({
			method: "GET",
			url: "/api/users?name=Rick&status=alive",
		});

		expect(response.statusCode).toBe(200);

		expect(findUsers).toHaveBeenCalledWith({
			name: "Rick",
			status: "alive",
			page: 1,
			limit: 10,
		});
	});

	it("deve retornar 400 para parâmetros inválidos", async () => {
		const response = await app.inject({
			method: "GET",
			url: "/api/users?status=invalid",
		});

		expect(response.statusCode).toBe(400);
		expect(findUsers).not.toHaveBeenCalled();
	});

	it("deve editar o nome de um usuário", async () => {
		vi.mocked(updateUserName).mockResolvedValue({
			...user,
			name: "Rick atualizado",
		});

		const response = await app.inject({
			method: "PATCH",
			url: "/api/users/1",
			payload: {
				name: "Rick atualizado",
			},
		});

		expect(response.statusCode).toBe(200);
		expect(updateUserName).toHaveBeenCalledWith(1, "Rick atualizado");
	});

	it("deve retornar 404 ao editar um usuário inexistente", async () => {
		vi.mocked(updateUserName).mockResolvedValue(undefined);

		const response = await app.inject({
			method: "PATCH",
			url: "/api/users/999",
			payload: {
				name: "Usuário inexistente",
			},
		});

		expect(response.statusCode).toBe(404);

		expect(response.json()).toEqual({
			message: "User not found",
		});
	});

	it("deve excluir um usuário existente", async () => {
		vi.mocked(deleteUser).mockResolvedValue(true);

		const response = await app.inject({
			method: "DELETE",
			url: "/api/users/1",
		});

		expect(response.statusCode).toBe(204);
		expect(deleteUser).toHaveBeenCalledWith(1);
	});

	it("deve retornar 500 sem expor detalhes internos", async () => {
		vi.mocked(findUsers).mockRejectedValue(new Error("Informação sensível"));

		const response = await app.inject({
			method: "GET",
			url: "/api/users",
		});

		expect(response.statusCode).toBe(500);

		expect(response.json()).toEqual({
			message: "Internal server error",
		});

		expect(response.body).not.toContain("Informação sensível");
	});
});
