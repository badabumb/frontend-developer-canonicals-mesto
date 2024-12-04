// card.js


export function createCard({ name, link }, cardTemplate, popupImage, popupCaption, openModal) {
    const cardElement = cardTemplate.cloneNode(true);

    const cardImage = cardElement.querySelector('.card__image');
    const cardTitle = cardElement.querySelector('.card__title');
    const likeButton = cardElement.querySelector('.card__like-button');
    const deleteButton = cardElement.querySelector('.card__delete-button');

    // Заполнение данных карточки
    cardImage.src = link;
    cardImage.alt = name;
    cardTitle.textContent = name;

    // Добавление обработчиков событий
    likeButton.addEventListener('click', () => {
        likeButton.classList.toggle('card__like-button_is-active');
    });

    deleteButton.addEventListener('click', () => {
        cardElement.remove();
    });

    cardImage.addEventListener('click', () => {
        popupImage.src = link;
        popupImage.alt = name;
        popupCaption.textContent = name;
        openModal(popupImage.closest('.popup'));
    });

    return cardElement;
}