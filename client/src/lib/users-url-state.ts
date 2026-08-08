import {
	DEFAULT_PAGE,
	DEFAULT_PAGE_SIZE,
	PAGE_SIZE_OPTIONS,
	USER_STATUS_FILTER_OPTIONS,
} from "../constants/users";
import type { UserStatusFilter } from "../types/user";

interface UsersUrlState {
	name: string;
	status: UserStatusFilter;
	page: number;
	limit: number;
}

const validStatuses = new Set<UserStatusFilter>(
	USER_STATUS_FILTER_OPTIONS.map(({ value }) => value),
);
const validPageSizes = new Set<number>(PAGE_SIZE_OPTIONS);

function getPositiveInteger(value: string | null, fallback: number): number {
	const parsedValue = Number(value);
	return Number.isInteger(parsedValue) && parsedValue > 0
		? parsedValue
		: fallback;
}

export function getUsersUrlState(): UsersUrlState {
	const params = new URLSearchParams(window.location.search);
	const status = params.get("status") ?? "";
	const limit = getPositiveInteger(params.get("limit"), DEFAULT_PAGE_SIZE);

	return {
		name: params.get("name")?.trim() ?? "",
		status: validStatuses.has(status as UserStatusFilter)
			? (status as UserStatusFilter)
			: "",
		page: getPositiveInteger(params.get("page"), DEFAULT_PAGE),
		limit: validPageSizes.has(limit) ? limit : DEFAULT_PAGE_SIZE,
	};
}

export function updateUsersUrlState(
	state: UsersUrlState,
	mode: "push" | "replace",
) {
	const url = new URL(window.location.href);

	if (state.name) url.searchParams.set("name", state.name);
	else url.searchParams.delete("name");

	if (state.status) url.searchParams.set("status", state.status);
	else url.searchParams.delete("status");

	if (state.page !== DEFAULT_PAGE)
		url.searchParams.set("page", String(state.page));
	else url.searchParams.delete("page");

	if (state.limit !== DEFAULT_PAGE_SIZE)
		url.searchParams.set("limit", String(state.limit));
	else url.searchParams.delete("limit");

	const nextUrl = `${url.pathname}${url.search}${url.hash}`;
	const currentUrl = `${window.location.pathname}${window.location.search}${window.location.hash}`;

	if (nextUrl !== currentUrl) {
		window.history[mode === "push" ? "pushState" : "replaceState"](
			null,
			"",
			nextUrl,
		);
	}
}
