import type { PaginationMeta } from "../../types/user";

interface PaginationProps {
	pagination: PaginationMeta;
	onPageChange: (page: number) => void;
	onLimitChange: (limit: number) => void;
}

type PageItem = number | "ellipsis-start" | "ellipsis-end";
const pageButtonClassName =
	"min-h-[34px] min-w-[34px] border-0 bg-transparent px-[7px] py-1 text-body";
const edgeButtonClassName =
	"min-h-[34px] border-0 bg-transparent px-1 py-1 text-xs font-bold text-brand underline underline-offset-3";

function getPages(currentPage: number, totalPages: number): PageItem[] {
	const visiblePageCount = 8;

	if (totalPages <= visiblePageCount)
		return Array.from({ length: totalPages }, (_, index) => index + 1);

	const pages: PageItem[] = [];
	const start = Math.max(
		1,
		Math.min(
			currentPage - Math.floor(visiblePageCount / 2),
			totalPages - visiblePageCount + 1,
		),
	);
	const end = start + visiblePageCount - 1;

	if (start > 1) pages.push("ellipsis-start");
	for (let page = start; page <= end; page += 1) pages.push(page);
	if (end < totalPages) pages.push("ellipsis-end");
	return pages;
}

export function Pagination({
	pagination,
	onPageChange,
	onLimitChange,
}: PaginationProps) {
	const firstResult =
		pagination.totalItems === 0
			? 0
			: (pagination.page - 1) * pagination.limit + 1;
	const lastResult = Math.min(
		pagination.page * pagination.limit,
		pagination.totalItems,
	);

	return (
		<footer className="grid w-full min-w-0 grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-5 border-[#e5e7e7] border-t px-4 py-[18px] text-sm max-[820px]:grid-cols-1 max-[820px]:justify-items-center max-[560px]:px-0">
			<p className="m-0">
				<span className="block">Showing results</span>
				<span className="block">
					{firstResult}-{lastResult} of {pagination.totalItems}
				</span>
			</p>

			{pagination.totalPages > 1 ? (
				<nav
					className="flex min-w-0 max-w-full flex-wrap items-center justify-center gap-1"
					aria-label="User pagination"
				>
					<button
						className={edgeButtonClassName}
						type="button"
						disabled={pagination.page === 1}
						onClick={() => onPageChange(1)}
					>
						First
					</button>
					<button
						className={pageButtonClassName}
						type="button"
						disabled={pagination.page === 1}
						aria-label="Previous page"
						onClick={() => onPageChange(pagination.page - 1)}
					>
						{"<"}
					</button>
					{getPages(pagination.page, pagination.totalPages).map((item) =>
						typeof item !== "number" ? (
							<span key={item} aria-hidden="true">
								…
							</span>
						) : (
							<button
								key={item}
								type="button"
								className={`${pageButtonClassName} ${item === pagination.page ? "font-bold text-brand underline underline-offset-[5px]" : ""}`}
								aria-current={item === pagination.page ? "page" : undefined}
								onClick={() => onPageChange(item)}
							>
								{item}
							</button>
						),
					)}
					<button
						className={pageButtonClassName}
						type="button"
						disabled={pagination.page === pagination.totalPages}
						aria-label="Next page"
						onClick={() => onPageChange(pagination.page + 1)}
					>
						{">"}
					</button>
					<button
						className={edgeButtonClassName}
						type="button"
						disabled={pagination.page === pagination.totalPages}
						onClick={() => onPageChange(pagination.totalPages)}
					>
						Last
					</button>
				</nav>
			) : (
				<span />
			)}

			<label className="flex items-center justify-self-end gap-2 whitespace-nowrap max-[820px]:justify-self-center">
				See
				<select
					className="min-h-[34px] rounded-lg border border-[#d7dada] bg-white px-2 py-1 text-body"
					value={pagination.limit}
					onChange={(event) => onLimitChange(Number(event.target.value))}
				>
					<option value="10">10</option>
					<option value="15">15</option>
					<option value="25">25</option>
					<option value="50">50</option>
				</select>
				per page
			</label>
		</footer>
	);
}
