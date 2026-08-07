import type { UserStatusFilter } from "../../types/user";

interface UserFiltersProps {
	name: string;
	status: UserStatusFilter;
	onNameChange: (name: string) => void;
	onStatusChange: (status: UserStatusFilter) => void;
	onSearch: () => void;
}

export function UserFilters({
	name,
	status,
	onNameChange,
	onStatusChange,
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
				<input
					className="min-h-[42px] w-full rounded-lg border border-[#d7dada] bg-white px-3 py-[9px] text-body"
					id="name-filter"
					type="search"
					value={name}
					onChange={(event) => onNameChange(event.target.value)}
				/>
			</div>

			<div className="grid gap-2">
				<label className="text-sm font-semibold" htmlFor="status-filter">
					Status
				</label>
				<select
					className="min-h-[42px] w-full rounded-lg border border-[#d7dada] bg-white px-3 py-[9px] text-body"
					id="status-filter"
					value={status}
					onChange={(event) =>
						onStatusChange(event.target.value as UserStatusFilter)
					}
				>
					<option value="" />
					<option value="alive">Alive</option>
					<option value="dead">Dead</option>
					<option value="unknown">Unknown</option>
				</select>
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
