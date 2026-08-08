import {
	keepPreviousData,
	useMutation,
	useQuery,
	useQueryClient,
} from "@tanstack/react-query";
import {
	deleteUser,
	getUsers,
	updateUserName,
} from "../services/users-service";
import type { ListUsersParams } from "../types/user";

const usersQueryKey = ["users"] as const;

export function useUsers(filters: ListUsersParams) {
	return useQuery({
		queryKey: [...usersQueryKey, filters],
		queryFn: () => getUsers(filters),
		placeholderData: keepPreviousData,
	});
}

export function useUpdateUserName() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ id, name }: { id: number; name: string }) =>
			updateUserName(id, name),
		onSuccess: () => queryClient.invalidateQueries({ queryKey: usersQueryKey }),
	});
}

export function useDeleteUser() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: deleteUser,
		onSuccess: () => queryClient.invalidateQueries({ queryKey: usersQueryKey }),
	});
}
