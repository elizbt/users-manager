import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { UserFilters } from "./user-filters";

describe("UserFilters", () => {
	it("envia as alterações dos filtros", async () => {
		const user = userEvent.setup();
		const onNameChange = vi.fn();
		const onStatusChange = vi.fn();

		render(
			<UserFilters
				name=""
				status=""
				onNameChange={onNameChange}
				onStatusChange={onStatusChange}
				onSearch={vi.fn()}
			/>,
		);

		await user.type(screen.getByRole("searchbox", { name: "Name" }), "Rick");
		await user.selectOptions(
			screen.getByRole("combobox", { name: "Status" }),
			"alive",
		);

		expect(onNameChange).toHaveBeenCalled();
		expect(onStatusChange).toHaveBeenCalledWith("alive");
	});
});
