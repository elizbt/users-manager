export type UserStatus = "Alive" | "Dead" | "unknown";

export interface UserOrigin {
	name: string;
	url: string;
}

export interface User {
	id: number;
	name: string;
	status: UserStatus;
	species: string;
	image: string;
	episode: string[];
	origin: UserOrigin;
	createdAt: string;
}

export interface Pagination {
	page: number;
	limit: number;
	totalItems: number;
	totalPages: number;
}

export interface PaginatedUsers {
	data: User[];
	pagination: Pagination;
}
