import type { USER_STATUS_FILTER_OPTIONS } from "../constants/users";

export type {
	PaginatedUsers,
	PaginationMeta,
	User,
	UserOrigin,
	UserStatus,
} from "../../../shared/types/user";

export type UserStatusFilter =
	| ""
	| (typeof USER_STATUS_FILTER_OPTIONS)[number]["value"];

export interface ListUsersParams {
	name: string;
	status: UserStatusFilter;
	page: number;
	limit: number;
}
