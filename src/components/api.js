const config = {
    baseUrl: 'https://nomoreparties.co/v1/frontend-st-cohort-201',
    headers: {
        authorization: 'bab2a2ef-11a4-4fac-b495-0bf0eed8fed1',
        'Content-Type': 'application/json'
    }
};

function checkResponse(res) {
    if (res.ok) {
        return res.json();
    }
    return Promise.reject(`Ошибка: ${res.status}`);
}

// Получение карточек
export function getCards() {
    return fetch(`${config.baseUrl}/cards`, {
        headers: config.headers
    }).then(checkResponse);
}

// Обновление профиля
export function updateProfile(name, about) {
    return fetch(`${config.baseUrl}/users/me`, {
        method: 'PATCH',
        headers: config.headers,
        body: JSON.stringify({ name, about })
    }).then(checkResponse);
}

// Получение данных профиля
export function getProfile() {
    return fetch(`${config.baseUrl}/users/me`, {
        headers: config.headers
    })
    .then(checkResponse);
}

// Функция для добавления новой карточки
export function addCard(name, link) {
    return fetch(`${config.baseUrl}/cards`, {
        method: 'POST',
        headers: config.headers,
        body: JSON.stringify({ name, link })
    })
    .then(checkResponse)
    .catch(err => {
        console.error('Ошибка при добавлении карточки:', err);
    });
}

// Удаление карточки
export function deleteCard(cardId) {
    return fetch(`${config.baseUrl}/cards/${cardId}`, {
        method: 'DELETE',
        headers: config.headers
    })
    .then(checkResponse)
    .catch(err => {
        console.error(`Ошибка при удалении карточки: ${err}`);
    });
}

export function toggleLike(cardId, isLiked) {
    const method = isLiked ? 'DELETE' : 'PUT'; // Определяем метод запроса
    return fetch(`${config.baseUrl}/cards/${cardId}/likes`, {
        method,
        headers: config.headers
    })
    .then(checkResponse)
    .catch(err => {
        console.error(`Ошибка: ${err}`);
    });
}

// Обновление аватара
export function updateAvatar(avatarUrl) {
    return fetch(`${config.baseUrl}/users/me/avatar`, {
        method: 'PATCH',
        headers: config.headers,
        body: JSON.stringify({ avatar: avatarUrl })
    })
    .then(checkResponse)
    .catch(err => {
        console.error(`Ошибка при обновлении аватара: ${err}`);
    });
}