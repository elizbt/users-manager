import { afterEach, describe, expect, it, vi } from "vitest";
import { fetchCharacters } from "../src/clients/rick-and-morty-client.js";

function createResponse(body: unknown): Response {
	return {
		ok: true,
		status: 200,
		statusText: "OK",
		headers: new Headers(),
		json: vi.fn().mockResolvedValue(body),
	} as unknown as Response;
}

afterEach(() => {
	vi.useRealTimers();
	vi.restoreAllMocks();
});

describe("Cliente da API Rick and Morty", () => {
	it("deve rejeitar uma resposta externa inválida", async () => {
		vi.spyOn(globalThis, "fetch").mockResolvedValue(
			createResponse({
				info: {
					pages: "inválido",
				},
				results: [],
			}),
		);

		await expect(fetchCharacters(vi.fn())).rejects.toThrow();
	});

	it("deve interromper após atingir o limite de tentativas", async () => {
		vi.useFakeTimers();

		const fetchMock = vi
			.spyOn(globalThis, "fetch")
			.mockRejectedValue(new Error("API indisponível"));

		const result = expect(fetchCharacters(vi.fn())).rejects.toThrow(
			"API indisponível",
		);

		await vi.advanceTimersByTimeAsync(10_000);
		await result;

		expect(fetchMock).toHaveBeenCalledTimes(5);
	});
});
