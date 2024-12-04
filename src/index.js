// @todo: Темплейт карточки

// @todo: DOM узлы

// @todo: Функция создания карточки

// @todo: Функция удаления карточки

// @todo: Вывести карточки на страницу

// index.js

import './pages/index.css';

import { enableValidation } from './components/validate.js';
import { createCard } from './components/card.js';
import { openModal, closeModal, closePopupOnOverlayClick } from './components/modal.js';


const initialCards = [
    {
      name: "Архыз",
      link: "https://pictures.s3.yandex.net/frontend-developer/cards-compressed/arkhyz.jpg",
    },
    {
      name: "Челябинская область",
      link: "https://pictures.s3.yandex.net/frontend-developer/cards-compressed/chelyabinsk-oblast.jpg",
    },
    {
      name: "Иваново",
      link: "https://pictures.s3.yandex.net/frontend-developer/cards-compressed/ivanovo.jpg",
    },
    {
      name: "Камчатка",
      link: "https://pictures.s3.yandex.net/frontend-developer/cards-compressed/kamchatka.jpg",
    },
    {
      name: "Холмогорский район",
      link: "https://pictures.s3.yandex.net/frontend-developer/cards-compressed/kholmogorsky-rayon.jpg",
    },
    {
      name: "Байкал",
      link: "https://pictures.s3.yandex.net/frontend-developer/cards-compressed/baikal.jpg",
    }
];


// Задаем параметры для валидации
const validationSettings = {
    formSelector: '.popup__form',
    inputSelector: '.popup__input',
    submitButtonSelector: '.popup__button',
    inactiveButtonClass: 'popup__button_disabled',
    inputErrorClass: 'popup__input_invalid',
    errorClass: 'popup__error_visible'
};

// Включаем валидацию
document.addEventListener('DOMContentLoaded', () => {
    enableValidation(validationSettings);
});

// Находим все поп-апы
const popups = document.querySelectorAll('.popup');
popups.forEach((popup) => {
    popup.classList.add('popup_is-animated');
});

// Найдем контейнер для карточек и шаблон
const placesList = document.querySelector('.places__list');
const cardTemplate = document.querySelector('#card-template').content.querySelector('.places__item');

// Попапы
const profilePopup = document.querySelector('.popup_type_edit');
const cardPopup = document.querySelector('.popup_type_new-card');
const imagePopup = document.querySelector('.popup_type_image');

// Кнопки для попапов
const profileEditButton = document.querySelector('.profile__edit-button');
const addCardButton = document.querySelector('.profile__add-button');
const profileCloseButton = profilePopup.querySelector('.popup__close');
const cardCloseButton = cardPopup.querySelector('.popup__close');
const imagePopupCloseButton = imagePopup.querySelector('.popup__close');

// Поля формы
const nameInput = profilePopup.querySelector('.popup__input_type_name');
const jobInput = profilePopup.querySelector('.popup__input_type_description');
const cardForm = cardPopup.querySelector('.popup__form');
const cardNameInput = cardPopup.querySelector('.popup__input_type_card-name');
const cardLinkInput = cardPopup.querySelector('.popup__input_type_url');

const profileForm = profilePopup.querySelector('.popup__form');

// Попап изображения
const popupImage = imagePopup.querySelector('.popup__image');
const popupCaption = imagePopup.querySelector('.popup__caption');

// Добавление карточек
function renderCards(cards) {
    cards.forEach(cardData => {
        const card = createCard(cardData, cardTemplate, popupImage, popupCaption, openModal);
        placesList.append(card);
    });
}

// Обработчики событий
profileEditButton.addEventListener('click', () => {
    nameInput.value = document.querySelector('.profile__title').textContent;
    jobInput.value = document.querySelector('.profile__description').textContent;
    openModal(profilePopup);
});

// Обработчик события отправки формы редактирования профиля
profileForm.addEventListener('submit', (evt) => {
    evt.preventDefault(); // Предотвращаем перезагрузку страницы
    // Обновляем информацию на странице
    document.querySelector('.profile__title').textContent = nameInput.value;
    document.querySelector('.profile__description').textContent = jobInput.value;
    closeModal(profilePopup); // Закрываем попап
});

cardForm.addEventListener('submit', (evt) => {
    evt.preventDefault();
    const newCard = createCard({
        name: cardNameInput.value,
        link: cardLinkInput.value
    }, cardTemplate, popupImage, popupCaption, openModal);
    placesList.prepend(newCard);
    closeModal(cardPopup);
    cardForm.reset();
});

addCardButton.addEventListener('click', () => {
    cardForm.reset();
    openModal(cardPopup);
});

profileCloseButton.addEventListener('click', () => closeModal(profilePopup));
cardCloseButton.addEventListener('click', () => closeModal(cardPopup));
imagePopupCloseButton.addEventListener('click', () => closeModal(imagePopup));

popups.forEach((popup) => {
    popup.addEventListener('mousedown', closePopupOnOverlayClick);
});

document.addEventListener('DOMContentLoaded', () => {
    renderCards(initialCards);
});
