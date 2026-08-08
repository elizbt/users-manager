import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Pagination } from "../components/users/pagination";

describe("Pagination", () => {
	it("navega entre as páginas e respeita os limites", async () => {
		const user = userEvent.setup();
		const onPageChange = vi.fn();

		render(
			<Pagination
				pagination={{ page: 1, limit: 10, totalItems: 25, totalPages: 3 }}
				onPageChange={onPageChange}
				onLimitChange={vi.fn()}
			/>,
		);

		expect(screen.getByRole("button", { name: "First" })).toBeDisabled();
		await user.click(screen.getByRole("button", { name: "2" }));
		expect(onPageChange).toHaveBeenCalledWith(2);
	});
});
