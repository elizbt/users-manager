import { api } from "../lib/api";
import type { ListUsersParams, PaginatedUsers, User } from "../types/user";

export async function getUsers(
	filters: ListUsersParams,
): Promise<PaginatedUsers> {
	const { data } = await api.get<PaginatedUsers>("/users", {
		params: {
			...(filters.name ? { name: filters.name } : {}),
			...(filters.status ? { status: filters.status } : {}),
			page: filters.page,
			limit: filters.limit,
		},
	});

	return data;
}

export async function updateUserName(id: number, name: string): Promise<User> {
	const { data } = await api.patch<User>(`/users/${id}`, { name });
	return data;
}

export async function deleteUser(id: number): Promise<void> {
	await api.delete(`/users/${id}`);
}
