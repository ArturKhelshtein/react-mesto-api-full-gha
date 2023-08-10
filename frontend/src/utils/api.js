class Api {
	constructor({ baseUrl, headers }) {
		this._baseUrl = baseUrl;
		this._headers = headers;
	}

	_checkResponse(result) {
		return result.ok
			? result.json()
			: Promise.reject(`Ошибка: ${result.status}`);
	}

	async _request(endpoint, options) {
		const result = await fetch(`${this._baseUrl}${endpoint}`, options);
		return this._checkResponse(result);
	}

	getUserInfo() {
		return this._request(`/users/me`, {
			headers: this._headers,
			credentials: 'include',
		});
	}

	getCardsInitial() {
		return this._request(`/cards`, {
			headers: this._headers,
			credentials: 'include',
		});
	}

	getAppInfo() {
		return Promise.all([this.getUserInfo(), this.getCardsInitial()]);
	}

	updateUserInfo({ name, about }) {
		return this._request(`/users/me`, {
			method: 'PATCH',
			credentials: 'include',
			headers: this._headers,
			body: JSON.stringify({
				name: name,
				about: about,
			}),
		});
	}

	updateUserAvatar(link) {
		return this._request(`/users/me/avatar`, {
			method: 'PATCH',
			credentials: 'include',
			headers: this._headers,
			body: JSON.stringify({
				avatar: link,
			}),
		});
	}

	addCard({ name, link }) {
		return this._request(`/cards`, {
			method: 'POST',
			credentials: 'include',
			headers: this._headers,
			body: JSON.stringify({
				link: link,
				name: name,
			}),
		});
	}

	deleteCard(id) {
		return this._request(`/cards/${id}`, {
			method: 'DELETE',
			credentials: 'include',
			headers: this._headers,
		});
	}

	setLike(id) {
		return this._request(`/cards/${id}/likes`, {
			method: 'PUT',
			credentials: 'include',
			headers: this._headers,
		});
	}

	removeLike(id) {
		return this._request(`/cards/${id}/likes`, {
			method: 'DELETE',
			credentials: 'include',
			headers: this._headers,
		});
	}

	changeLikeCardStatus(id, isLiked) {
		return isLiked ? this.setLike(id) : this.removeLike(id);
	}
}

const api = new Api({
	// baseUrl: 'https://mesto.nomoreparties.co/v1/cohort-65',
	baseUrl: 'http://localhost:4000',
	headers: {
		authorization: '4bf1734f-e403-4a51-8791-c178d19695e4',
		'Content-Type': 'application/json',
	},
});

export default api;
