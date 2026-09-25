import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import Login from "./Login.jsx";

function renderLogin(onLogin = vi.fn()) {
	render(
		<MemoryRouter>
			<Login onLogin={onLogin} />
		</MemoryRouter>
	);
	return onLogin;
}

describe("Login", () => {
	it("keeps the submit button disabled until email and password are valid", async () => {
		const user = userEvent.setup();
		renderLogin();

		const submitButton = screen.getByRole("button", { name: /inicia sesión/i });
		expect(submitButton).toBeDisabled();

		await user.type(screen.getByPlaceholderText("Correo electrónico"), "user@mail.com");
		await user.type(screen.getByPlaceholderText("Contraseña"), "password123");

		expect(submitButton).toBeEnabled();
	});

	it("shows a validation message for an invalid email", async () => {
		const user = userEvent.setup();
		renderLogin();

		const emailInput = screen.getByPlaceholderText("Correo electrónico");
		await user.type(emailInput, "not-an-email");
		emailInput.blur();

		expect(emailInput).toBeInvalid();
	});

	it("calls onLogin with the entered credentials on submit", async () => {
		const user = userEvent.setup();
		const onLogin = renderLogin();

		await user.type(screen.getByPlaceholderText("Correo electrónico"), "user@mail.com");
		await user.type(screen.getByPlaceholderText("Contraseña"), "password123");
		await user.click(screen.getByRole("button", { name: /inicia sesión/i }));

		expect(onLogin).toHaveBeenCalledWith("user@mail.com", "password123");
	});
});
