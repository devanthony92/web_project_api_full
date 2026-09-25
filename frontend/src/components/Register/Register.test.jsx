import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import Register from "./Register.jsx";

function renderRegister(onRegister = vi.fn()) {
	render(
		<MemoryRouter>
			<Register onRegister={onRegister} />
		</MemoryRouter>
	);
	return onRegister;
}

describe("Register", () => {
	it("keeps the submit button disabled until the form is valid", async () => {
		const user = userEvent.setup();
		renderRegister();

		const submitButton = screen.getByRole("button", { name: /regístrate/i });
		expect(submitButton).toBeDisabled();

		await user.type(screen.getByPlaceholderText("Correo electrónico"), "user@mail.com");
		await user.type(screen.getByPlaceholderText("Contraseña"), "password123");
		expect(submitButton).toBeDisabled();

		await user.type(screen.getByPlaceholderText("Confirmar contraseña"), "password123");

		expect(submitButton).toBeEnabled();
	});

	it("shows an error and keeps the button disabled when the passwords do not match", async () => {
		const user = userEvent.setup();
		renderRegister();

		await user.type(screen.getByPlaceholderText("Correo electrónico"), "user@mail.com");
		await user.type(screen.getByPlaceholderText("Contraseña"), "password123");
		await user.type(screen.getByPlaceholderText("Confirmar contraseña"), "password124");

		expect(screen.getByText("Las contraseñas no coinciden")).toBeInTheDocument();
		expect(screen.getByRole("button", { name: /regístrate/i })).toBeDisabled();
	});

	it("does not show the mismatch error while the confirmation is still being typed", async () => {
		const user = userEvent.setup();
		renderRegister();

		await user.type(screen.getByPlaceholderText("Contraseña"), "password123");
		await user.type(screen.getByPlaceholderText("Confirmar contraseña"), "pass");

		expect(screen.queryByText("Las contraseñas no coinciden")).not.toBeInTheDocument();
	});

	it("calls onRegister with the entered credentials on submit", async () => {
		const user = userEvent.setup();
		const onRegister = renderRegister();

		await user.type(screen.getByPlaceholderText("Correo electrónico"), "new@mail.com");
		await user.type(screen.getByPlaceholderText("Contraseña"), "password123");
		await user.type(screen.getByPlaceholderText("Confirmar contraseña"), "password123");
		await user.click(screen.getByRole("button", { name: /regístrate/i }));

		expect(onRegister).toHaveBeenCalledWith("new@mail.com", "password123");
	});
});
