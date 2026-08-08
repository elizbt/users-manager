import { useCallback, useEffect, useState } from "react";
import { DEFAULT_PAGE } from "../constants/users";
import { getUsersUrlState, updateUsersUrlState } from "../lib/users-url-state";
import type { ListUsersParams, UserStatusFilter } from "../types/user";

type UserFilters = Pick<ListUsersParams, "name" | "status">;

export function useUsersListState() {
	const [initialState] = useState(getUsersUrlState);
	const [filters, setFilters] = useState<UserFilters>({
		name: initialState.name,
		status: initialState.status,
	});
	const [name, setName] = useState(initialState.name);
	const [status, setStatus] = useState<UserStatusFilter>(initialState.status);
	const [page, setPage] = useState(initialState.page);
	const [limit, setLimit] = useState(initialState.limit);

	useEffect(() => {
		updateUsersUrlState(getUsersUrlState(), "replace");

		function handlePopState() {
			const nextState = getUsersUrlState();
			setName(nextState.name);
			setStatus(nextState.status);
			setFilters({ name: nextState.name, status: nextState.status });
			setPage(nextState.page);
			setLimit(nextState.limit);
			updateUsersUrlState(nextState, "replace");
		}

		window.addEventListener("popstate", handlePopState);
		return () => window.removeEventListener("popstate", handlePopState);
	}, []);

	function applyFilters(nextFilters: UserFilters) {
		setPage(DEFAULT_PAGE);
		setFilters(nextFilters);
		updateUsersUrlState({ ...nextFilters, page: DEFAULT_PAGE, limit }, "push");
	}

	function handleSearch() {
		applyFilters({ name: name.trim(), status });
	}

	function handleNameChange(nextName: string) {
		setName(nextName);
		if (!nextName && name) applyFilters({ name: "", status });
	}

	function handleStatusChange(nextStatus: UserStatusFilter) {
		setStatus(nextStatus);
	}

	function handleStatusClear() {
		setStatus("");
		applyFilters({ name: name.trim(), status: "" });
	}

	function handlePageChange(nextPage: number) {
		setPage(nextPage);
		updateUsersUrlState({ ...filters, page: nextPage, limit }, "push");
	}

	function handleLimitChange(nextLimit: number) {
		setPage(DEFAULT_PAGE);
		setLimit(nextLimit);
		updateUsersUrlState(
			{ ...filters, page: DEFAULT_PAGE, limit: nextLimit },
			"push",
		);
	}

	const correctPage = useCallback(
		(totalPages: number) => {
			const nextPage = totalPages === 0 ? DEFAULT_PAGE : totalPages;
			if (page <= nextPage) return;

			setPage(nextPage);
			updateUsersUrlState({ ...filters, page: nextPage, limit }, "replace");
		},
		[filters, limit, page],
	);

	return {
		name,
		status,
		queryParams: { ...filters, page, limit },
		handleSearch,
		handleNameChange,
		handleStatusChange,
		handleStatusClear,
		handlePageChange,
		handleLimitChange,
		correctPage,
	};
}
