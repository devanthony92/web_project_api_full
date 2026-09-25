import { describe, it, expect, vi, beforeEach } from "vitest";
import api from "./Api.js";

describe("Api unauthorized handling", () => {
	beforeEach(() => {
		api.setUnauthorizedHandler(null);
	});

	it("calls the registered handler when a response is 401", () => {
		const handler = vi.fn();
		api.setUnauthorizedHandler(handler);

		api._handleResponse({ status: 401, ok: false }).catch(() => {});

		expect(handler).toHaveBeenCalledTimes(1);
	});

	it("does not call the handler for other error statuses", () => {
		const handler = vi.fn();
		api.setUnauthorizedHandler(handler);

		api._handleResponse({ status: 403, ok: false }).catch(() => {});

		expect(handler).not.toHaveBeenCalled();
	});

	it("rejects with the message sent by the server", async () => {
		await expect(
			api._handleResponse({
				status: 400,
				ok: false,
				json: () => Promise.resolve({ message: "Se enviaron datos inválidos" }),
			})
		).rejects.toThrow("Se enviaron datos inválidos");
	});

	it("resolves the JSON body for a successful response", async () => {
		const body = { email: "user@mail.com" };
		const result = await api._handleResponse({
			status: 200,
			ok: true,
			json: () => Promise.resolve(body),
		});

		expect(result).toEqual(body);
	});
});
