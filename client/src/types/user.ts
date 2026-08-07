export type {
	PaginatedUsers,
	PaginationMeta,
	User,
	UserOrigin,
	UserStatus,
} from "../../../shared/types/user";

export type UserStatusFilter = "" | "alive" | "dead" | "unknown";

export interface ListUsersParams {
	name: string;
	status: UserStatusFilter;
	page: number;
	limit: number;
}
