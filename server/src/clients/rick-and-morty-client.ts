import { z } from "zod";

const characterSchema = z.object({
	id: z.number(),
	name: z.string(),
	status: z.enum(["Alive", "Dead", "unknown"]),
	species: z.string(),
	image: z.string(),
	episode: z.array(z.string()),
	origin: z.object({
		name: z.string(),
		url: z.string(),
	}),
	created: z.string(),
});

const apiResponseSchema = z.object({
	info: z.object({
		pages: z.number(),
	}),
	results: z.array(characterSchema),
});

export type RickAndMortyCharacter = z.infer<typeof characterSchema>;

const pageBatchSize = 3;
const maxFetchAttempts = 5;
const requestTimeout = 10_000;
const batchDelay = 500;

function wait(milliseconds: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

async function fetchPage(page: number) {
	let lastError: unknown;

	for (let attempt = 1; attempt <= maxFetchAttempts; attempt += 1) {
		let response: Response;

		try {
			response = await fetch(
				`https://rickandmortyapi.com/api/character?page=${page}`,
				{ signal: AbortSignal.timeout(requestTimeout) },
			);
		} catch (error) {
			lastError = error;

			if (attempt === maxFetchAttempts) {
				throw error;
			}

			await wait(attempt * 1_000);
			continue;
		}

		if (response.ok) {
			return apiResponseSchema.parse(await response.json());
		}

		lastError = new Error(
			`Failed to load page ${page}: ${response.status} ${response.statusText}`,
		);

		if (response.status < 500 && response.status !== 429) {
			throw lastError;
		}

		if (attempt === maxFetchAttempts) {
			throw lastError;
		}

		const retryAfter = Number(response.headers.get("retry-after"));
		await wait(
			Number.isFinite(retryAfter) && retryAfter > 0
				? retryAfter * 1_000
				: attempt * 1_000,
		);
	}

	throw lastError ?? new Error(`Failed to load page ${page}`);
}

export async function fetchCharacters(
	onBatch: (characters: RickAndMortyCharacter[]) => Promise<void>,
): Promise<void> {
	const firstPage = await fetchPage(1);
	await onBatch(firstPage.results);

	for (let page = 2; page <= firstPage.info.pages; page += pageBatchSize) {
		const pages = Array.from(
			{ length: Math.min(pageBatchSize, firstPage.info.pages - page + 1) },
			(_, index) => page + index,
		);
		const responses = await Promise.all(pages.map(fetchPage));
		await onBatch(responses.flatMap((response) => response.results));
		await wait(batchDelay);
	}
}
