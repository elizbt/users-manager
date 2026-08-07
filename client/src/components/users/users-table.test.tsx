import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import type { User } from "../../types/user";
import { UsersTable } from "./users-table";

const userData: User = {
	id: 1,
	name: "Rick Sanchez",
	status: "Alive",
	species: "Human",
	episode: [],
	origin: { name: "Earth", url: "" },
	createdAt: "2017-11-04T18:48:46.250Z",
};

describe("UsersTable", () => {
	it("exibe os dados e permite selecionar as ações", async () => {
		const user = userEvent.setup();
		const onEdit = vi.fn();
		const onDelete = vi.fn();

		render(
			<UsersTable users={[userData]} onEdit={onEdit} onDelete={onDelete} />,
		);

		expect(screen.getByText("Rick Sanchez")).toBeInTheDocument();
		expect(screen.getByText("Alive")).toBeInTheDocument();

		await user.dblClick(screen.getByText("Rick Sanchez"));
		await user.click(
			screen.getByRole("button", { name: /Delete Rick Sanchez/ }),
		);

		expect(onEdit).toHaveBeenCalledWith(userData);
		expect(onDelete).toHaveBeenCalledWith(userData);
	});
});
