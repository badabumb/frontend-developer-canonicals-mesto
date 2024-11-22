// @todo: Темплейт карточки

// @todo: DOM узлы

// @todo: Функция создания карточки

// @todo: Функция удаления карточки

// @todo: Вывести карточки на страницу

document.addEventListener('DOMContentLoaded', () => {
    renderCards(initialCards);
});

// Найти все поп-апы
const popups = document.querySelectorAll('.popup');

// Добавить класс popup_is-animated всем поп-апам
popups.forEach((popup) => {
    popup.classList.add('popup_is-animated');
});

const placesList = document.querySelector('.places__list');
const cardTemplate = document.querySelector('#card-template').content.querySelector('.places__item');


// Поиск поп-апов
const profilePopup = document.querySelector('.popup_type_edit');
const cardPopup = document.querySelector('.popup_type_new-card');
const imagePopup = document.querySelector('.popup_type_image');

// Кнопки для попапов
const profileEditButton = document.querySelector('.profile__edit-button');
const profileCloseButton = profilePopup.querySelector('.popup__close');
const addCardButton = document.querySelector('.profile__add-button');
const cardCloseButton = cardPopup.querySelector('.popup__close');
const imagePopupCloseButton = imagePopup.querySelector('.popup__close');

// Поля формы профиля
const nameInput = profilePopup.querySelector('.popup__input_type_name');
const jobInput = profilePopup.querySelector('.popup__input_type_description');
const profileName = document.querySelector('.profile__title');
const profileDescription = document.querySelector('.profile__description');
const profileFormElement = profilePopup.querySelector('.popup__form');

// Поля формы добавления карточки
const cardForm = cardPopup.querySelector('.popup__form');
const cardNameInput = cardPopup.querySelector('.popup__input_type_card-name');
const cardLinkInput = cardPopup.querySelector('.popup__input_type_url');

// Попап изображения
const popupImage = imagePopup.querySelector('.popup__image');
const popupCaption = imagePopup.querySelector('.popup__caption');


// === Функции работы с попапами ===
function openModal(popup) {
    popup.classList.add('popup_is-opened');
}

function closeModal(popup) {
    popup.classList.remove('popup_is-opened');
}

// === Функции работы с карточками ===

function createCard({ name, link }) {
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
        openModal(imagePopup);
    });

    return cardElement;
}

function renderCards(cards) {
    cards.forEach(cardData => {
      const card = createCard(cardData);
      placesList.append(card);
    });
}

// Добавление новой карточки
function handleCardFormSubmit(evt) {
    evt.preventDefault();

    const name = cardNameInput.value;
    const link = cardLinkInput.value;

    const newCard = createCard({ name, link });
    placesList.prepend(newCard); // Добавляем карточку в начало списка

    closeModal(cardPopup); // Закрываем попап
    cardForm.reset(); // Очищаем форму
}



// === Обработчики профиля ===

// Открытие поп-апа и заполнение полей текущими значениями
function openProfilePopup() {
    nameInput.value = profileName.textContent; // Заполнение полей текущими данными
    jobInput.value = profileDescription.textContent;
    openModal(profilePopup); // Открытие поп-апа
}

// Обработчик отправки формы
function handleProfileFormSubmit(evt) {
    evt.preventDefault(); // Отмена стандартной отправки формы

    // Обновление данных профиля
    profileName.textContent = nameInput.value;
    profileDescription.textContent = jobInput.value;

    closeModal(profilePopup); // Закрытие поп-апа
}

// === Слушатели событий ===

// Редактирование профиля
profileEditButton.addEventListener('click', openProfilePopup);
profileCloseButton.addEventListener('click', () => closeModal(profilePopup));
profileFormElement.addEventListener('submit', handleProfileFormSubmit);

// Добавление карточек
addCardButton.addEventListener('click', () => {
    cardForm.reset(); // Очистка полей формы
    openModal(cardPopup);
});
cardCloseButton.addEventListener('click', () => closeModal(cardPopup));
cardForm.addEventListener('submit', handleCardFormSubmit);

// Закрытие попапа с изображением
imagePopupCloseButton.addEventListener('click', () => closeModal(imagePopup));