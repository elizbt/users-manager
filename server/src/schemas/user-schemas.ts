import { z } from "zod";

export const listUsersQuerySchema = z.object({
	name: z.string().trim().min(1).optional(),

	status: z
		.string()
		.trim()
		.toLowerCase()
		.pipe(z.enum(["alive", "dead", "unknown"]))
		.optional(),

	page: z.coerce.number().int().positive().default(1),

	limit: z.coerce.number().int().positive().max(100).default(10),
});

export const userParamsSchema = z.object({
	id: z.coerce.number().int().positive(),
});

export const updateUserBodySchema = z
	.object({
		name: z.string().trim().min(1).max(100),
	})
	.strict();

export type ListUsersQuery = z.infer<typeof listUsersQuerySchema>;
