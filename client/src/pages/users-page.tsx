import { useCallback, useEffect, useState } from "react";
import { Toast } from "../components/feedback/toast";
import { DeleteUserDialog } from "../components/users/delete-user-dialog";
import { EditUserDialog } from "../components/users/edit-user-dialog";
import { Pagination } from "../components/users/pagination";
import { UserFilters } from "../components/users/user-filters";
import { UsersTable } from "../components/users/users-table";
import { useDeleteUser, useUpdateUserName, useUsers } from "../hooks/use-users";
import { useUsersListState } from "../hooks/use-users-list-state";
import { getApiErrorMessage } from "../lib/api";
import type { User } from "../types/user";

const feedbackClassName =
	"rounded-lg border border-[#d7dada] border-dashed px-6 py-12 text-center";

export function UsersPage() {
	const listState = useUsersListState();
	const [editingUser, setEditingUser] = useState<User | null>(null);
	const [deletingUser, setDeletingUser] = useState<User | null>(null);
	const [toast, setToast] = useState<{
		type: "success" | "error";
		message: string;
	} | null>(null);
	const usersQuery = useUsers(listState.queryParams);
	const updateMutation = useUpdateUserName();
	const deleteMutation = useDeleteUser();
	const closeToast = useCallback(() => setToast(null), []);

	useEffect(() => {
		if (usersQuery.isPlaceholderData) return;

		const totalPages = usersQuery.data?.pagination.totalPages;
		if (totalPages === undefined) return;
		listState.correctPage(totalPages);
	}, [
		listState.correctPage,
		usersQuery.data?.pagination.totalPages,
		usersQuery.isPlaceholderData,
	]);

	function closeEditDialog() {
		setEditingUser(null);
	}

	function closeDeleteDialog() {
		setDeletingUser(null);
	}

	function openEditDialog(user: User) {
		updateMutation.reset();
		setEditingUser(user);
	}

	function openDeleteDialog(user: User) {
		deleteMutation.reset();
		setDeletingUser(user);
	}

	function handleRetry() {
		void usersQuery.refetch();
	}

	function handleEditUser(newName: string) {
		if (!editingUser || newName === editingUser.name.trim()) return;

		updateMutation.mutate(
			{ id: editingUser.id, name: newName },
			{
				onSuccess: () => {
					closeEditDialog();
					setToast({
						type: "success",
						message: "User successfully edited.",
					});
				},
			},
		);
	}

	function handleDeleteUser() {
		if (!deletingUser) return;

		deleteMutation.mutate(deletingUser.id, {
			onSuccess: () => {
				closeDeleteDialog();
				setToast({
					type: "success",
					message: "User successfully deleted.",
				});
			},
			onError: () =>
				setToast({ type: "error", message: "Error deleting user." }),
		});
	}

	return (
		<main className="min-h-screen w-dvw max-w-[100dvw] overflow-x-hidden">
			<section className="mx-auto w-full min-w-0 max-w-[1180px] px-6 pt-14 pb-10.5 max-[560px]:px-3 max-[560px]:pt-8 max-[560px]:pb-6">
				<h1 className="m-0 border-[#e5e7e7] border-b pb-4.5 text-2xl font-semibold text-heading">
					User Management
				</h1>
				<UserFilters
					name={listState.name}
					status={listState.status}
					onNameChange={listState.handleNameChange}
					onStatusChange={listState.handleStatusChange}
					onStatusClear={listState.handleStatusClear}
					onSearch={listState.handleSearch}
				/>

				<div className="min-w-0" aria-busy={usersQuery.isFetching}>
					{usersQuery.isFetching && !usersQuery.isPending ? (
						<span className="sr-only" role="status">
							Updating users...
						</span>
					) : null}
					{usersQuery.isPending ? (
						<p className={feedbackClassName} role="status">
							Loading users...
						</p>
					) : usersQuery.isError ? (
						<section className={feedbackClassName} role="alert">
							<p>{getApiErrorMessage(usersQuery.error)}</p>
							<button
								className="min-h-10 rounded-lg border border-brand bg-white px-4 py-2 text-brand"
								type="button"
								onClick={handleRetry}
							>
								Try again
							</button>
						</section>
					) : usersQuery.data.data.length === 0 ? (
						<p className={feedbackClassName}>No users found.</p>
					) : (
						<>
							<UsersTable
								users={usersQuery.data.data}
								onEdit={openEditDialog}
								onDelete={openDeleteDialog}
							/>
							<Pagination
								pagination={usersQuery.data.pagination}
								onPageChange={listState.handlePageChange}
								onLimitChange={listState.handleLimitChange}
							/>
						</>
					)}
				</div>
			</section>

			{editingUser ? (
				<EditUserDialog
					user={editingUser}
					isPending={updateMutation.isPending}
					error={updateMutation.error}
					onClose={closeEditDialog}
					onSave={handleEditUser}
				/>
			) : null}

			{deletingUser ? (
				<DeleteUserDialog
					user={deletingUser}
					isPending={deleteMutation.isPending}
					onClose={closeDeleteDialog}
					onConfirm={handleDeleteUser}
				/>
			) : null}

			{toast ? (
				<Toast type={toast.type} message={toast.message} onClose={closeToast} />
			) : null}
		</main>
	);
}
