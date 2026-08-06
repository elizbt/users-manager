import { fetchCharacters } from "../clients/rick-and-morty-client.js";
import { prisma } from "../database.js";

try {
	await fetchCharacters(async (characters) => {
		await prisma.$transaction(
			characters.map((character) =>
				prisma.user.upsert({
					where: { id: character.id },
					update: {},
					create: {
						id: character.id,
						name: character.name,
						status: character.status,
						species: character.species,
						originName: character.origin.name,
						originUrl: character.origin.url,
						image: character.image,
						episode: character.episode,
						createdAt: character.created,
					},
				}),
			),
		);
	});
} catch (error) {
	console.error(error);
	process.exitCode = 1;
} finally {
	await prisma.$disconnect();
}
