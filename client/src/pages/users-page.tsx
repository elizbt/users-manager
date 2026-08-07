import { useCallback, useEffect, useState } from "react";
import { Toast } from "../components/feedback/toast";
import { DeleteUserDialog } from "../components/users/delete-user-dialog";
import { EditUserDialog } from "../components/users/edit-user-dialog";
import { Pagination } from "../components/users/pagination";
import { UserFilters } from "../components/users/user-filters";
import { UsersTable } from "../components/users/users-table";
import { useDeleteUser, useUpdateUserName, useUsers } from "../hooks/use-users";
import { getApiErrorMessage } from "../lib/api";
import type { User, UserStatusFilter } from "../types/user";

const feedbackClassName =
	"rounded-lg border border-[#d7dada] border-dashed px-6 py-12 text-center";

export function UsersPage() {
	const [name, setName] = useState("");
	const [status, setStatus] = useState<UserStatusFilter>("");
	const [filters, setFilters] = useState({
		name: "",
		status: "" as UserStatusFilter,
	});
	const [page, setPage] = useState(1);
	const [limit, setLimit] = useState(10);
	const [editingUser, setEditingUser] = useState<User | null>(null);
	const [deletingUser, setDeletingUser] = useState<User | null>(null);
	const [toast, setToast] = useState<{
		type: "success" | "error";
		message: string;
	} | null>(null);
	const usersQuery = useUsers({ ...filters, page, limit });
	const updateMutation = useUpdateUserName();
	const deleteMutation = useDeleteUser();
	const closeEditDialog = useCallback(() => setEditingUser(null), []);
	const closeDeleteDialog = useCallback(() => setDeletingUser(null), []);
	const closeToast = useCallback(() => setToast(null), []);

	useEffect(() => {
		const totalPages = usersQuery.data?.pagination.totalPages;
		if (totalPages !== undefined && totalPages > 0 && page > totalPages) {
			setPage(totalPages);
		}
	}, [page, usersQuery.data?.pagination.totalPages]);

	function openEditDialog(user: User) {
		updateMutation.reset();
		setEditingUser(user);
	}

	function openDeleteDialog(user: User) {
		deleteMutation.reset();
		setDeletingUser(user);
	}

	function handleSearch() {
		setPage(1);
		setFilters({ name: name.trim(), status });
	}

	function handleLimitChange(newLimit: number) {
		setPage(1);
		setLimit(newLimit);
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
					name={name}
					status={status}
					onNameChange={setName}
					onStatusChange={setStatus}
					onSearch={handleSearch}
				/>

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
							onPageChange={setPage}
							onLimitChange={handleLimitChange}
						/>
					</>
				)}
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
