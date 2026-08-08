import { Search, TriangleAlert } from "lucide-react";
import { useState } from "react";
import { getApiErrorMessage } from "../../lib/api";
import type { User } from "../../types/user";
import { AppDialog } from "../ui/app-dialog";

interface EditUserDialogProps {
	user: User;
	isPending: boolean;
	error: unknown;
	onClose: () => void;
	onSave: (name: string) => void;
}

export function EditUserDialog({
	user,
	isPending,
	error,
	onClose,
	onSave,
}: EditUserDialogProps) {
	const [name, setName] = useState(user.name);
	const trimmedName = name.trim();
	const hasChanges = trimmedName !== user.name.trim();

	return (
		<AppDialog labelledBy="edit-title" isPending={isPending} onClose={onClose}>
			<h2
				className="mb-[22px] flex items-center gap-[10px] text-xl font-semibold text-heading"
				id="edit-title"
			>
				<TriangleAlert
					className="text-danger"
					size={24}
					strokeWidth={1.8}
					aria-hidden="true"
				/>
				Edit User
			</h2>
			<form
				onSubmit={(event) => {
					event.preventDefault();
					onSave(trimmedName);
				}}
			>
				<div className="grid gap-2 border-[#e5e7e7] border-b-2 pb-6">
					<label className="sr-only" htmlFor="edit-name">
						Name
					</label>
					<div className="relative">
						<Search
							className="absolute top-1/2 left-3 -translate-y-1/2 text-[#8a8e8e]"
							size={18}
							strokeWidth={2.5}
							aria-hidden="true"
						/>
						<input
							className="min-h-[42px] w-full rounded-lg border border-[#d7dada] bg-white py-[9px] pr-3 pl-10 text-body"
							id="edit-name"
							maxLength={100}
							required
							value={name}
							onChange={(event) => setName(event.target.value)}
						/>
					</div>
				</div>
				{error ? (
					<p className="text-danger" role="alert">
						{getApiErrorMessage(error)}
					</p>
				) : null}
				<div className="mt-6 flex items-center justify-between">
					<button
						className="min-h-10 rounded-lg border-0 bg-transparent py-2 pr-[22px] pl-0 text-brand underline underline-offset-3"
						type="button"
						disabled={isPending}
						onClick={onClose}
					>
						Cancel
					</button>
					<button
						className="min-h-10 rounded-lg border-0 bg-brand px-[22px] py-2 font-semibold text-white"
						type="submit"
						disabled={!trimmedName || !hasChanges || isPending}
					>
						{isPending ? "Editing..." : "Edit"}
					</button>
				</div>
			</form>
		</AppDialog>
	);
}
