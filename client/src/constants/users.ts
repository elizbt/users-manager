export const DEFAULT_PAGE = 1;
export const PAGE_SIZE_OPTIONS = [10, 15, 25, 50] as const;
export const DEFAULT_PAGE_SIZE = PAGE_SIZE_OPTIONS[0];

export const USER_STATUS_FILTER_OPTIONS = [
	{ value: "alive", label: "Alive" },
	{ value: "dead", label: "Dead" },
	{ value: "unknown", label: "Unknown" },
] as const;
