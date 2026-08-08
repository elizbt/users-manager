import { z } from "zod";
import type { UserStatus } from "../../../shared/types/user.js";

const normalizedStatus = {
	alive: "Alive",
	dead: "Dead",
	unknown: "unknown",
} as const satisfies Record<Lowercase<UserStatus>, UserStatus>;

export const listUsersQuerySchema = z.object({
	name: z.string().trim().min(1).optional(),

	status: z
		.string()
		.trim()
		.toLowerCase()
		.pipe(z.enum(["alive", "dead", "unknown"]))
		.transform((status) => normalizedStatus[status])
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
