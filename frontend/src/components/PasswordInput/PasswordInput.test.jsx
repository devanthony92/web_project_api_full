import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import PasswordInput from "./PasswordInput.jsx";

describe("PasswordInput", () => {
	it("hides the toggle button when the field is empty", () => {
		render(<PasswordInput value="" onChange={vi.fn()} />);
		expect(
			screen.queryByRole("button", { name: /mostrar contraseña/i })
		).not.toBeInTheDocument();
	});

	it("shows the toggle button once there is a value", () => {
		render(<PasswordInput value="secret" onChange={vi.fn()} />);
		expect(
			screen.getByRole("button", { name: /mostrar contraseña/i })
		).toBeInTheDocument();
	});

	it("toggles the input type between password and text when clicked", async () => {
		const user = userEvent.setup();
		render(<PasswordInput value="secret" onChange={vi.fn()} />);

		const input = screen.getByPlaceholderText("Contraseña");
		expect(input).toHaveAttribute("type", "password");

		await user.click(screen.getByRole("button", { name: /mostrar contraseña/i }));
		expect(input).toHaveAttribute("type", "text");

		await user.click(screen.getByRole("button", { name: /ocultar contraseña/i }));
		expect(input).toHaveAttribute("type", "password");
	});
});
