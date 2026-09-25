import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute.jsx";

function renderWithRouter(loggedIn) {
	return render(
		<MemoryRouter initialEntries={["/"]}>
			<Routes>
				<Route
					path="/"
					element={
						<ProtectedRoute loggedIn={loggedIn}>
							<p>Contenido protegido</p>
						</ProtectedRoute>
					}
				/>
				<Route path="/signin" element={<p>Página de inicio de sesión</p>} />
			</Routes>
		</MemoryRouter>
	);
}

describe("ProtectedRoute", () => {
	it("redirects to /signin when the user is not logged in", () => {
		renderWithRouter(false);
		expect(screen.getByText("Página de inicio de sesión")).toBeInTheDocument();
		expect(screen.queryByText("Contenido protegido")).not.toBeInTheDocument();
	});

	it("renders the protected content when the user is logged in", () => {
		renderWithRouter(true);
		expect(screen.getByText("Contenido protegido")).toBeInTheDocument();
	});
});
