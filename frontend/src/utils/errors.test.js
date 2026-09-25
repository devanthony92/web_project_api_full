import { describe, it, expect } from "vitest";
import { getErrorMessage, getUserMessage } from "./errors.js";

describe("getErrorMessage", () => {
	it("returns the message sent by the server", async () => {
		const res = { status: 400, json: () => Promise.resolve({ message: "Datos inválidos" }) };

		expect(await getErrorMessage(res)).toBe("Datos inválidos");
	});

	it("falls back to the status when the body has no message", async () => {
		const res = { status: 500, json: () => Promise.reject(new Error("no json")) };

		expect(await getErrorMessage(res)).toBe("Error 500");
	});

	it("falls back to the status when the response cannot be parsed", async () => {
		expect(await getErrorMessage({ status: 403 })).toBe("Error 403");
	});
});

describe("getUserMessage", () => {
	it("shows the message of a regular error", () => {
		expect(getUserMessage(new Error("Se requiere autorización"))).toBe(
			"Se requiere autorización"
		);
	});

	it("translates network failures", () => {
		expect(getUserMessage(new TypeError("Failed to fetch"))).toMatch(
			/No se pudo conectar/
		);
	});
});
