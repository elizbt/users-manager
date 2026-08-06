import { prisma } from "../database.js";
import type {
	User as DatabaseUser,
	Prisma,
} from "../generated/prisma/client.js";
import type { ListUsersQuery } from "../schemas/user-schemas.js";
import type { PaginatedUsers, User } from "../types/user.js";

function mapUser(user: DatabaseUser): User {
	return {
		id: user.id,
		name: user.name,
		status: user.status,
		species: user.species,
		image: user.image,
		episode: user.episode,
		origin: {
			name: user.originName,
			url: user.originUrl,
		},
		createdAt: user.createdAt.toISOString(),
	};
}

export async function findUsers(
	filters: ListUsersQuery,
): Promise<PaginatedUsers> {
	const status =
		filters.status === "alive"
			? "Alive"
			: filters.status === "dead"
				? "Dead"
				: filters.status;
	const where: Prisma.UserWhereInput = {
		...(filters.name && {
			name: { contains: filters.name, mode: "insensitive" },
		}),
		...(status && {
			status,
		}),
	};
	const skip = (filters.page - 1) * filters.limit;

	const [users, totalItems] = await Promise.all([
		prisma.user.findMany({
			where,
			orderBy: { id: "asc" },
			skip,
			take: filters.limit,
		}),
		prisma.user.count({ where }),
	]);

	return {
		data: users.map(mapUser),
		pagination: {
			page: filters.page,
			limit: filters.limit,
			totalItems,
			totalPages: Math.ceil(totalItems / filters.limit),
		},
	};
}

export async function updateUserName(
	id: number,
	name: string,
): Promise<User | undefined> {
	const [user] = await prisma.user.updateManyAndReturn({
		where: { id },
		data: { name },
	});

	return user ? mapUser(user) : undefined;
}

export async function deleteUser(id: number): Promise<boolean> {
	const result = await prisma.user.deleteMany({ where: { id } });
	return result.count === 1;
}
