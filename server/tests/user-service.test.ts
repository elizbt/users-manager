import { beforeEach, describe, expect, it, vi } from "vitest";
import { prisma } from "../src/database.js";
import { UserStatus } from "../src/generated/prisma/client.js";
import { findUsers } from "../src/services/user-service.js";

vi.mock("../src/database.js", () => ({
	prisma: {
		user: {
			findMany: vi.fn(),
			count: vi.fn(),
		},
	},
}));

const databaseUser = {
	id: 1,
	name: "Rick Sanchez",
	status: UserStatus.Alive,
	species: "Human",
	originName: "Earth",
	originUrl: "https://example.com/location/1",
	episode: [],
	createdAt: new Date("2017-11-04T18:48:46.250Z"),
};

beforeEach(() => {
	vi.resetAllMocks();
});

describe("Serviço de usuários", () => {
	it("deve aplicar filtros e calcular a paginação", async () => {
		vi.mocked(prisma.user.findMany).mockResolvedValue([databaseUser]);
		vi.mocked(prisma.user.count).mockResolvedValue(21);

		const result = await findUsers({
			name: "Rick",
			status: "alive",
			page: 2,
			limit: 10,
		});

		expect(prisma.user.findMany).toHaveBeenCalledWith({
			where: {
				name: {
					contains: "Rick",
					mode: "insensitive",
				},
				status: UserStatus.Alive,
			},
			orderBy: {
				id: "asc",
			},
			skip: 10,
			take: 10,
		});

		expect(result.pagination).toEqual({
			page: 2,
			limit: 10,
			totalItems: 21,
			totalPages: 3,
		});
	});

	it("deve retornar um estado vazio consistente", async () => {
		vi.mocked(prisma.user.findMany).mockResolvedValue([]);
		vi.mocked(prisma.user.count).mockResolvedValue(0);

		const result = await findUsers({
			page: 1,
			limit: 10,
		});

		expect(result).toEqual({
			data: [],
			pagination: {
				page: 1,
				limit: 10,
				totalItems: 0,
				totalPages: 0,
			},
		});
	});
});
