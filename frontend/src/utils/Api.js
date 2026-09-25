import { API_BASE_URL } from "./constants.js";
import { getErrorMessage } from "./errors.js";

class Api {
	constructor() {
		this._urlBase = API_BASE_URL;
		this._headers = { "Content-Type": "application/json" };
		this._onUnauthorized = null;
	}
	setToken(token) {
		this._headers = {
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		};
	}
	setUnauthorizedHandler(handler) {
		this._onUnauthorized = handler;
	}
	_handleResponse = (res) => {
		if (res.status === 401) {
			this._onUnauthorized?.();
		}
		if (!res.ok) {
			return getErrorMessage(res).then((message) =>
				Promise.reject(new Error(message))
			);
		}
		return res.json();
	};
	async getInitialCards() {
		return fetch(`${this._urlBase}/cards/`, {
			headers: this._headers,
		}).then(this._handleResponse);
	}
	async getUserInfo() {
		return fetch(`${this._urlBase}/users/me`, {
			headers: this._headers,
		}).then(this._handleResponse);
	}
	getAppData() {
		return Promise.all([this.getUserInfo(), this.getInitialCards()]);
	}

	async setUserInfo({ name, about }) {
		return fetch(`${this._urlBase}/users/me`, {
			method: "PATCH",
			headers: this._headers,
			body: JSON.stringify({
				name: `${name}`,
				about: `${about}`,
			}),
		}).then(this._handleResponse);
	}
	async setUserAvatar({ avatar }) {
		return fetch(`${this._urlBase}/users/me/avatar`, {
			method: "PATCH",
			headers: this._headers,
			body: JSON.stringify({
				avatar: `${avatar}`,
			}),
		}).then(this._handleResponse);
	}
	async createNewCard({ name, link }) {
		return fetch(`${this._urlBase}/cards/`, {
			method: "POST",
			headers: this._headers,
			body: JSON.stringify({
				name: `${name}`,
				link: `${link}`,
			}),
		}).then(this._handleResponse);
	}
	async updateCard(id, { name, link }) {
		return fetch(`${this._urlBase}/cards/${id}`, {
			method: "PATCH",
			headers: this._headers,
			body: JSON.stringify({ name: `${name}`, link: `${link}` }),
		}).then(this._handleResponse);
	}
	async isLiked(id, isLiked) {
		return fetch(`${this._urlBase}/cards/${id}/likes`, {
			method: isLiked ? "DELETE" : "PUT",
			headers: this._headers,
		}).then(this._handleResponse);
	}
	async deleteCard(id) {
		return fetch(`${this._urlBase}/cards/${id}`, {
			method: "DELETE",
			headers: this._headers,
		}).then(this._handleResponse);
	}
}

const api = new Api();
export default api;
