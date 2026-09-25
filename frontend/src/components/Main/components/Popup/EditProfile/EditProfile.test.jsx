import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import EditProfile from "./EditProfile.jsx";
import { CurrentUserContext } from "../../../../../contexts/CurrentUserContext";

function renderEditProfile(handleUpdateUser) {
	const onClose = vi.fn();
	render(
		<CurrentUserContext.Provider
			value={{
				currentUser: { name: "Ana", about: "Exploradora" },
				handleUpdateUser,
			}}
		>
			<EditProfile props={onClose} />
		</CurrentUserContext.Provider>
	);
	return onClose;
}

describe("EditProfile", () => {
	it("closes the popup only after the profile was saved", async () => {
		const user = userEvent.setup();
		const handleUpdateUser = vi.fn().mockResolvedValue();
		const onClose = renderEditProfile(handleUpdateUser);

		await user.click(screen.getByRole("button", { name: /guardar/i }));

		expect(handleUpdateUser).toHaveBeenCalledWith({
			name: "Ana",
			about: "Exploradora",
		});
		expect(onClose).toHaveBeenCalledTimes(1);
	});

	it("shows the server message and keeps the popup open when saving fails", async () => {
		const user = userEvent.setup();
		const handleUpdateUser = vi
			.fn()
			.mockRejectedValue(new Error("Se enviaron datos inválidos"));
		const onClose = renderEditProfile(handleUpdateUser);

		await user.click(screen.getByRole("button", { name: /guardar/i }));

		expect(await screen.findByRole("alert")).toHaveTextContent(
			"Se enviaron datos inválidos"
		);
		expect(onClose).not.toHaveBeenCalled();
		expect(screen.getByRole("button", { name: /guardar/i })).toBeEnabled();
	});

	it("explains a network failure in plain words", async () => {
		const user = userEvent.setup();
		const handleUpdateUser = vi.fn().mockRejectedValue(new TypeError("Failed to fetch"));
		renderEditProfile(handleUpdateUser);

		await user.click(screen.getByRole("button", { name: /guardar/i }));

		expect(await screen.findByRole("alert")).toHaveTextContent(
			"No se pudo conectar con el servidor"
		);
	});
});

describe("EditProfile when closed before the server answers", () => {
	it("reports the failure through the global error notice", async () => {
		const user = userEvent.setup();
		let rejectRequest;
		const handleUpdateUser = vi.fn(
			() => new Promise((_, reject) => { rejectRequest = reject; })
		);
		const showError = vi.fn();
		const onClose = vi.fn();
		const { unmount } = render(
			<CurrentUserContext.Provider
				value={{
					currentUser: { name: "Ana", about: "Exploradora" },
					handleUpdateUser,
					showError,
				}}
			>
				<EditProfile props={onClose} />
			</CurrentUserContext.Provider>
		);

		await user.click(screen.getByRole("button", { name: /guardar/i }));
		unmount();
		const error = new Error("Se enviaron datos inválidos");
		rejectRequest(error);
		await Promise.resolve();
		await Promise.resolve();

		expect(showError).toHaveBeenCalledWith(error);
		expect(onClose).not.toHaveBeenCalled();
	});
});
