import { z } from "zod";

const characterSchema = z.object({
	id: z.number(),
	name: z.string(),
	status: z.enum(["Alive", "Dead", "unknown"]),
	species: z.string(),
	episode: z.array(z.string()),
	origin: z.object({
		name: z.string(),
		url: z.string(),
	}),
	created: z.string(),
});

export const rickAndMortyResponseSchema = z.object({
	info: z.object({
		pages: z.number(),
	}),
	results: z.array(characterSchema),
});

export type RickAndMortyCharacter = z.infer<typeof characterSchema>;
