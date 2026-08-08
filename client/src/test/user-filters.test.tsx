import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ComponentProps } from "react";
import { describe, expect, it, vi } from "vitest";
import { UserFilters } from "../components/users/user-filters";

function renderUserFilters(
	overrides: Partial<ComponentProps<typeof UserFilters>> = {},
) {
	const props: ComponentProps<typeof UserFilters> = {
		name: "",
		status: "",
		onNameChange: vi.fn(),
		onStatusChange: vi.fn(),
		onStatusClear: vi.fn(),
		onSearch: vi.fn(),
		...overrides,
	};

	render(<UserFilters {...props} />);
	return props;
}

describe("UserFilters", () => {
	it("envia o formulário de busca", async () => {
		const user = userEvent.setup();
		const onSearch = vi.fn();
		renderUserFilters({ onSearch });

		await user.click(screen.getByRole("button", { name: "Search" }));

		expect(onSearch).toHaveBeenCalledOnce();
	});

	it("envia as alterações dos filtros", async () => {
		const user = userEvent.setup();
		const onNameChange = vi.fn();
		const onStatusChange = vi.fn();

		renderUserFilters({ onNameChange, onStatusChange });

		await user.type(screen.getByRole("searchbox", { name: "Name" }), "Rick");
		await user.selectOptions(
			screen.getByRole("combobox", { name: "Status" }),
			"alive",
		);

		expect(onNameChange).toHaveBeenCalled();
		expect(onStatusChange).toHaveBeenCalledWith("alive");
	});

	it("permite limpar o nome preenchido", async () => {
		const user = userEvent.setup();
		const onNameChange = vi.fn();

		renderUserFilters({ name: "Rick", onNameChange });

		await user.click(screen.getByRole("button", { name: "Clear name filter" }));

		expect(onNameChange).toHaveBeenCalledWith("");
	});

	it("permite limpar o status selecionado", async () => {
		const user = userEvent.setup();
		const onStatusClear = vi.fn();

		renderUserFilters({ status: "alive", onStatusClear });

		await user.click(
			screen.getByRole("button", { name: "Clear status filter" }),
		);

		expect(onStatusClear).toHaveBeenCalledOnce();
	});
});
