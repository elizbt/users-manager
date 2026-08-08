import { Pencil, Trash } from "lucide-react";
import type { User } from "../../types/user";

const dateFormatter = new Intl.DateTimeFormat("pt-BR");
const headerClassName =
	"border-[#eceeee] border-b bg-transparent px-4 py-[15px] text-left text-sm font-semibold uppercase tracking-[0.035em] text-heading";
const cellClassName =
	"[overflow-wrap:anywhere] border-[#eceeee] border-b px-4 py-[15px] text-left";
const actionButtonClassName =
	"grid size-9 min-h-9 place-items-center rounded-full border-0 bg-interaction opacity-0 transition-opacity duration-150 group-hover:opacity-100 focus-visible:opacity-100 max-[820px]:opacity-100";

interface UsersTableProps {
	users: User[];
	onEdit: (user: User) => void;
	onDelete: (user: User) => void;
}

export function UsersTable({ users, onEdit, onDelete }: UsersTableProps) {
	return (
		<div className="relative isolate w-full min-w-0 max-w-full touch-pan-x overflow-x-auto overscroll-x-none [clip-path:inset(0)]">
			<table className="w-full min-w-[900px] table-fixed border-collapse">
				<caption className="sr-only">User list</caption>
				<colgroup>
					<col className="w-[22%]" />
					<col className="w-[11%]" />
					<col className="w-[13%]" />
					<col className="w-[10%]" />
					<col className="w-1/5" />
					<col className="w-[16%]" />
					<col className="w-[8%]" />
				</colgroup>
				<thead>
					<tr>
						<th className={headerClassName} scope="col">
							Name
						</th>
						<th className={headerClassName} scope="col">
							Status
						</th>
						<th className={headerClassName} scope="col">
							Specie
						</th>
						<th className={headerClassName} scope="col">
							Episodes
						</th>
						<th className={headerClassName} scope="col">
							Origin
						</th>
						<th className={headerClassName} scope="col">
							Created at
						</th>
						<th className={headerClassName} scope="col">
							<span className="sr-only">Actions</span>
						</th>
					</tr>
				</thead>
				<tbody>
					{users.map((user) => (
						<tr
							className="group hover:bg-[#d8d9d9] last:[&>td]:border-b-0"
							key={user.id}
							onDoubleClick={() => onEdit(user)}
						>
							<td className={cellClassName} data-label="Name">
								{user.name}
							</td>
							<td className={cellClassName} data-label="Status">
								{user.status}
							</td>
							<td className={cellClassName} data-label="Specie">
								{user.species}
							</td>
							<td className={cellClassName} data-label="Episodes">
								{user.episode.length}
							</td>
							<td className={cellClassName} data-label="Origin">
								{user.origin.name}
							</td>
							<td className={cellClassName} data-label="Created at">
								<time dateTime={user.createdAt}>
									{dateFormatter.format(new Date(user.createdAt))}
								</time>
							</td>
							<td
								className="border-[#eceeee] border-b px-[10px]"
								data-label="Actions"
							>
								<div className="flex justify-center gap-1">
									<button
										type="button"
										className={`${actionButtonClassName} text-brand/70`}
										onClick={() => onEdit(user)}
										onDoubleClick={(event) => event.stopPropagation()}
									>
										<Pencil size={18} strokeWidth={2} aria-hidden="true" />
										<span className="sr-only">Edit {user.name}</span>
									</button>
									<button
										type="button"
										className={`${actionButtonClassName} text-brand`}
										onClick={() => onDelete(user)}
										onDoubleClick={(event) => event.stopPropagation()}
									>
										<Trash size={19} strokeWidth={2} aria-hidden="true" />
										<span className="sr-only">Delete {user.name}</span>
									</button>
								</div>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}
