import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import EditCard from "./EditCard.jsx";
import { CurrentUserContext } from "../../../../../contexts/CurrentUserContext";

const card = { _id: "card-1", name: "Lago", link: "https://example.com/lago.jpg" };

function renderEditCard(handleUpdateCard) {
	const onClose = vi.fn();
	render(
		<CurrentUserContext.Provider value={{ handleUpdateCard }}>
			<EditCard card={card} props={onClose} />
		</CurrentUserContext.Provider>
	);
	return onClose;
}

describe("EditCard", () => {
	it("starts with the current title and link", () => {
		renderEditCard(vi.fn());

		expect(screen.getByPlaceholderText("Titulo")).toHaveValue("Lago");
		expect(screen.getByPlaceholderText("Enlace a la imagen")).toHaveValue(
			"https://example.com/lago.jpg"
		);
	});

	it("saves the changes for that card and closes the popup", async () => {
		const user = userEvent.setup();
		const handleUpdateCard = vi.fn().mockResolvedValue();
		const onClose = renderEditCard(handleUpdateCard);

		await user.clear(screen.getByPlaceholderText("Titulo"));
		await user.type(screen.getByPlaceholderText("Titulo"), "Lago nuevo");
		await user.click(screen.getByRole("button", { name: /guardar/i }));

		expect(handleUpdateCard).toHaveBeenCalledWith("card-1", {
			name: "Lago nuevo",
			link: "https://example.com/lago.jpg",
		});
		expect(onClose).toHaveBeenCalledTimes(1);
	});

	it("keeps the popup open and shows the server message when saving fails", async () => {
		const user = userEvent.setup();
		const handleUpdateCard = vi
			.fn()
			.mockRejectedValue(new Error("No puedes editar una tarjeta de otro usuario"));
		const onClose = renderEditCard(handleUpdateCard);

		await user.click(screen.getByRole("button", { name: /guardar/i }));

		expect(await screen.findByRole("alert")).toHaveTextContent(
			"No puedes editar una tarjeta de otro usuario"
		);
		expect(onClose).not.toHaveBeenCalled();
	});

	it("does not save an empty title", async () => {
		const user = userEvent.setup();
		const handleUpdateCard = vi.fn();
		renderEditCard(handleUpdateCard);

		await user.clear(screen.getByPlaceholderText("Titulo"));

		expect(screen.getByRole("button", { name: /guardar/i })).toBeDisabled();
		expect(handleUpdateCard).not.toHaveBeenCalled();
	});
});
