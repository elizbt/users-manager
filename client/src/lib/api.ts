import axios from "axios";

export const api = axios.create({
	baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:3000/api",
	timeout: 10_000,
});

export function getApiErrorMessage(error: unknown): string {
	if (axios.isAxiosError<{ message?: string }>(error)) {
		return error.response?.data.message ?? "Unable to complete the operation.";
	}

	return "An unexpected error occurred.";
}
