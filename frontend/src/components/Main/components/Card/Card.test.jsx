import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Card from "./Card.jsx";
import { CurrentUserContext } from "../../../../contexts/CurrentUserContext";

const currentUser = { _id: "user-1", email: "me@mail.com" };

function renderCard(card, user = currentUser, onEdit = vi.fn()) {
	return render(
		<CurrentUserContext.Provider value={{ currentUser: user }}>
			<Card card={card} onOpen={vi.fn()} onEdit={onEdit} onDelete={vi.fn()} />
		</CurrentUserContext.Provider>
	);
}

describe("Card", () => {
	it("shows the delete button when the card belongs to the current user", () => {
		renderCard({
			_id: "card-1",
			name: "Lugar propio",
			link: "https://example.com/img.jpg",
			owner: "user-1",
			likes: [],
		});

		expect(screen.getByRole("button", { name: /delete card/i })).toBeInTheDocument();
	});

	it("hides the delete button when the card belongs to another user", () => {
		renderCard({
			_id: "card-2",
			name: "Lugar ajeno",
			link: "https://example.com/img2.jpg",
			owner: "user-2",
			likes: [],
		});

		expect(
			screen.queryByRole("button", { name: /delete card/i })
		).not.toBeInTheDocument();
	});

	it("marks the like button as active when the current user already liked the card", () => {
		renderCard({
			_id: "card-3",
			name: "Lugar con like",
			link: "https://example.com/img3.jpg",
			owner: "user-2",
			likes: ["user-1"],
		});

		expect(screen.getByRole("button", { name: /like card/i })).toHaveClass(
			"card__like--active"
		);
	});

	it("shows the edit button only when the card belongs to the current user", () => {
		const { unmount } = renderCard({
			_id: "card-4",
			name: "Lugar propio",
			link: "https://example.com/img.jpg",
			owner: "user-1",
			likes: [],
		});
		expect(screen.getByRole("button", { name: /edit card/i })).toBeInTheDocument();
		unmount();

		renderCard({
			_id: "card-5",
			name: "Lugar ajeno",
			link: "https://example.com/img2.jpg",
			owner: "user-2",
			likes: [],
		});
		expect(
			screen.queryByRole("button", { name: /edit card/i })
		).not.toBeInTheDocument();
	});

	it("calls onEdit when the edit button is clicked", async () => {
		const user = userEvent.setup();
		const onEdit = vi.fn();
		renderCard(
			{
				_id: "card-6",
				name: "Lugar propio",
				link: "https://example.com/img.jpg",
				owner: "user-1",
				likes: [],
			},
			currentUser,
			onEdit
		);

		await user.click(screen.getByRole("button", { name: /edit card/i }));

		expect(onEdit).toHaveBeenCalledTimes(1);
	});
});
