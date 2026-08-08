import { X } from "lucide-react";
import { USER_STATUS_FILTER_OPTIONS } from "../../constants/users";
import type { UserStatusFilter } from "../../types/user";

const clearButtonClassName =
	"absolute top-1/2 grid size-7 -translate-y-1/2 place-items-center rounded-full border-0 bg-transparent text-body";

interface UserFiltersProps {
	name: string;
	status: UserStatusFilter;
	onNameChange: (name: string) => void;
	onStatusChange: (status: UserStatusFilter) => void;
	onStatusClear: () => void;
	onSearch: () => void;
}

export function UserFilters({
	name,
	status,
	onNameChange,
	onStatusChange,
	onStatusClear,
	onSearch,
}: UserFiltersProps) {
	return (
		<form
			className="my-8 grid w-full min-w-0 grid-cols-[minmax(0,380px)_minmax(0,220px)_auto] items-end gap-5 max-[820px]:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] max-[560px]:grid-cols-1 max-[560px]:gap-4"
			aria-label="User filters"
			onSubmit={(event) => {
				event.preventDefault();
				onSearch();
			}}
		>
			<div className="grid gap-2">
				<label className="text-sm font-semibold" htmlFor="name-filter">
					Name
				</label>
				<div className="relative">
					<input
						className="min-h-[42px] w-full rounded-lg border border-[#d7dada] bg-white py-[9px] pr-10 pl-3 text-body [&::-webkit-search-cancel-button]:hidden"
						id="name-filter"
						type="search"
						value={name}
						onChange={(event) => onNameChange(event.target.value)}
					/>
					{name ? (
						<button
							className={`${clearButtonClassName} right-2`}
							type="button"
							aria-label="Clear name filter"
							onClick={() => onNameChange("")}
						>
							<X size={16} aria-hidden="true" />
						</button>
					) : null}
				</div>
			</div>

			<div className="grid gap-2">
				<label className="text-sm font-semibold" htmlFor="status-filter">
					Status
				</label>
				<div className="relative">
					<select
						className="min-h-[42px] w-full rounded-lg border border-[#d7dada] bg-white py-[9px] pr-16 pl-3 text-body"
						id="status-filter"
						value={status}
						onChange={(event) =>
							onStatusChange(event.target.value as UserStatusFilter)
						}
					>
						<option value="" disabled />
						{USER_STATUS_FILTER_OPTIONS.map((option) => (
							<option key={option.value} value={option.value}>
								{option.label}
							</option>
						))}
					</select>
					{status ? (
						<button
							className={`${clearButtonClassName} right-8`}
							type="button"
							aria-label="Clear status filter"
							onClick={onStatusClear}
						>
							<X size={16} aria-hidden="true" />
						</button>
					) : null}
				</div>
			</div>

			<button
				className="min-h-[42px] w-[84px] rounded-lg border-0 bg-brand px-3 py-[9px] font-semibold text-white max-[820px]:col-start-2 max-[820px]:justify-self-end max-[560px]:col-start-1 max-[560px]:justify-self-start"
				type="submit"
			>
				Search
			</button>
		</form>
	);
}
