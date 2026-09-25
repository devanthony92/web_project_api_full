import { API_BASE_URL } from "./constants.js";
import { getErrorMessage } from "./errors.js";

function handleResponse(res) {
	if (!res.ok) {
		return getErrorMessage(res).then((message) =>
			Promise.reject(new Error(message))
		);
	}
	return res.json();
}

export function register(email, password) {
	return fetch(`${API_BASE_URL}/signup`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ email, password }),
	}).then(handleResponse);
}

export function login(email, password) {
	return fetch(`${API_BASE_URL}/signin`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ email, password }),
	}).then(handleResponse);
}

export function checkToken(token) {
	return fetch(`${API_BASE_URL}/users/me`, {
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		},
	}).then(handleResponse);
}
