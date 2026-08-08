import { TriangleAlert } from "lucide-react";
import type { User } from "../../types/user";
import { AppDialog } from "../ui/app-dialog";

interface DeleteUserDialogProps {
	user: User;
	isPending: boolean;
	onClose: () => void;
	onConfirm: () => void;
}

export function DeleteUserDialog({
	user,
	isPending,
	onClose,
	onConfirm,
}: DeleteUserDialogProps) {
	return (
		<AppDialog
			labelledBy="delete-title"
			describedBy="delete-description"
			role="alertdialog"
			isPending={isPending}
			onClose={onClose}
		>
			<h2
				className="mb-[22px] flex items-center gap-[10px] text-xl font-semibold text-heading"
				id="delete-title"
			>
				<TriangleAlert
					className="text-danger"
					size={24}
					strokeWidth={2}
					aria-hidden="true"
				/>
				Delete User
			</h2>
			<p id="delete-description">
				Are you sure you want to delete the user &quot;{user.name}&quot;? This
				action cannot be undone.
			</p>
			<div className="mt-6 flex items-center justify-between border-[#e5e7e7] border-t-2 pt-6">
				<button
					className="min-h-10 rounded-lg border-0 bg-transparent py-2 pr-[22px] pl-0 text-brand underline underline-offset-3"
					type="button"
					disabled={isPending}
					onClick={onClose}
				>
					Cancel
				</button>
				<button
					type="button"
					className="min-h-10 rounded-lg border-0 bg-danger px-[22px] py-2 text-white"
					disabled={isPending}
					onClick={onConfirm}
				>
					{isPending ? "Deleting..." : "Delete"}
				</button>
			</div>
		</AppDialog>
	);
}
