export type UserStatus = "Alive" | "Dead" | "unknown";
export type UserStatusFilter = "" | "alive" | "dead" | "unknown";

export interface User {
	id: number;
	name: string;
	status: UserStatus;
	species: string;
	episode: string[];
	origin: {
		name: string;
		url: string;
	};
	createdAt: string;
}

export interface PaginationMeta {
	page: number;
	limit: number;
	totalItems: number;
	totalPages: number;
}

export interface PaginatedUsers {
	data: User[];
	pagination: PaginationMeta;
}

export interface ListUsersParams {
	name: string;
	status: UserStatusFilter;
	page: number;
	limit: number;
}
