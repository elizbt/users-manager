import {
	type RickAndMortyCharacter,
	rickAndMortyResponseSchema,
} from "../schemas/rick-and-morty-schemas.js";

const pageBatchSize = 3;
const maxFetchAttempts = 5;
const requestTimeoutMs = 10_000;
const retryBaseDelayMs = 1_000;
const batchDelayMs = 500;

function delay(milliseconds: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

async function fetchPage(page: number) {
	let lastError: unknown;

	for (let attempt = 1; attempt <= maxFetchAttempts; attempt += 1) {
		let response: Response;

		try {
			response = await fetch(
				`https://rickandmortyapi.com/api/character?page=${page}`,
				{ signal: AbortSignal.timeout(requestTimeoutMs) },
			);
		} catch (error) {
			lastError = error;

			if (attempt === maxFetchAttempts) {
				throw error;
			}

			await delay(attempt * retryBaseDelayMs);
			continue;
		}

		if (response.ok) {
			return rickAndMortyResponseSchema.parse(await response.json());
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
		await delay(
			Number.isFinite(retryAfter) && retryAfter > 0
				? retryAfter * retryBaseDelayMs
				: attempt * retryBaseDelayMs,
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

		if (page + pages.length <= firstPage.info.pages) {
			await delay(batchDelayMs);
		}
	}
}
