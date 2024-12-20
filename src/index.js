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
import { getCards, updateProfile, getProfile, addCard, deleteCard, toggleLike, updateAvatar } from './components/api.js';

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

function toggleSubmitButtonState(button, isLoading, loadingText = 'Сохранение...') {
    if (isLoading) {
        button.textContent = loadingText;
        button.disabled = true;
    } else {
        button.textContent = button.dataset.defaultText || 'Сохранить';
        button.disabled = false;
    }
}

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
const avatarPopup = document.querySelector('.popup_type_avatar-edit');

// Кнопки для попапов
const profileEditButton = document.querySelector('.profile__edit-button');
const addCardButton = document.querySelector('.profile__add-button');
const profileCloseButton = profilePopup.querySelector('.popup__close');
const cardCloseButton = cardPopup.querySelector('.popup__close');
const imagePopupCloseButton = imagePopup.querySelector('.popup__close');
const avatarButton = document.querySelector('.profile__edit-image-button');
const avatarImageButton = document.querySelector('.profile__avatar-edit-icon');
const avatarCloseButton = avatarPopup.querySelector('.popup__close');

// Поля формы
const nameInput = profilePopup.querySelector('.popup__input_type_name');
const jobInput = profilePopup.querySelector('.popup__input_type_description');
const profileForm = profilePopup.querySelector('.popup__form');
const cardForm = cardPopup.querySelector('.popup__form');
const cardNameInput = cardPopup.querySelector('.popup__input_type_card-name');
const cardLinkInput = cardPopup.querySelector('.popup__input_type_url');

const avatarForm = avatarPopup.querySelector('.popup__form');
const avatarLinkInput = avatarPopup.querySelector('.popup__input_type_url');


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

// Добавление карточек с сервера
function renderCardsFromServer() {
    let userId;

    getProfile()
        .then(profile => {
            userId = profile._id; // Сохраняем ID пользователя
            return getCards();   // Загружаем карточки
        })
        .then(cards => {
            cards.forEach(cardData => {
                const card = createCard(
                    {
                        name: cardData.name,
                        link: cardData.link,
                        likes: cardData.likes,
                        _id: cardData._id,
                        owner: cardData.owner // Информация о владельце карточки
                    },
                    cardTemplate,
                    popupImage,
                    popupCaption,
                    openModal,
                    userId, // Передаем ID пользователя в createCard
                    deleteCard, // Передаем функцию удаления карточки
                    toggleLike
                );
                placesList.append(card);
            });
        })
        .catch(err => {
            console.error(`Ошибка при загрузке карточек: ${err}`);
        });
}

// Обработчики событий
profileEditButton.addEventListener('click', () => {
    nameInput.value = document.querySelector('.profile__title').textContent;
    jobInput.value = document.querySelector('.profile__description').textContent;
    openModal(profilePopup);
});

avatarButton.addEventListener('click', () => {
    avatarForm.reset();
    openModal(avatarPopup);
});

avatarImageButton.addEventListener('click', () => {
    avatarForm.reset();
    openModal(avatarPopup);
});

avatarForm.addEventListener('submit', (evt) => {
    evt.preventDefault();

    const submitButton = avatarForm.querySelector('.popup__button');
    toggleSubmitButtonState(submitButton, true);

    const link = avatarLinkInput.value;

    updateAvatar(link)
        .then(() => {
            // После успешного обновления аватара на сервере, обновляем аватар на странице
            document.querySelector('.profile__image').style.backgroundImage = `url(${link})`;
            closeModal(avatarPopup);  // Закрываем попап
        })
        .catch(err => {
            console.error('Ошибка при обновлении аватара:', err);
        })
        .finally(() => {
            toggleSubmitButtonState(submitButton, false);
        });
});

// Обработчик отправки формы редактирования профиля
profileForm.addEventListener('submit', (evt) => {
    evt.preventDefault();  // Предотвращаем перезагрузку страницы

    const submitButton = profileForm.querySelector('.popup__button');
    toggleSubmitButtonState(submitButton, true);
  
    // Получаем новые данные из формы
    const name = nameInput.value;
    const about = jobInput.value;
  
    // Используем уже существующую функцию updateProfile для отправки данных на сервер
    updateProfile(name, about)
      .then(() => {
        // После успешного обновления профиля на сервере, загружаем актуальные данные
        getProfile()
          .then(data => {
            // Обновляем данные на странице
            document.querySelector('.profile__title').textContent = data.name;
            document.querySelector('.profile__description').textContent = data.about;
            closeModal(profilePopup);  // Закрываем попап после успешного обновления
          })
          .catch(err => {
            console.error('Ошибка при получении данных профиля:', err);
          });
      })
      .catch(err => {
        console.error('Ошибка при обновлении данных профиля на сервере:', err);
      })
      .finally(() => {
        toggleSubmitButtonState(submitButton, false);
    });
});

// Обработчик отправки формы для добавления новой карточки
cardForm.addEventListener('submit', (evt) => {
    evt.preventDefault();  // Предотвращаем перезагрузку страницы

    let userId = getProfile()
        .then(profile => {
            userId = profile._id; // Сохраняем ID пользователя
        })

    const submitButton = cardForm.querySelector('.popup__button');
    toggleSubmitButtonState(submitButton, true);
    
    const name = cardNameInput.value;  // Получаем название карточки из поля формы
    const link = cardLinkInput.value;  // Получаем ссылку на изображение из поля формы

    // Отправляем запрос на сервер для добавления карточки
    addCard(name, link)
        .then(cardData => {
            // Если карточка успешно добавлена, создаем её на странице
            const newCard = createCard(
                {
                    name: cardData.name,
                    link: cardData.link,
                    likes: cardData.likes,
                    _id: cardData._id,
                    owner: cardData.owner // Информация о владельце карточки
                },
                cardTemplate,
                popupImage,
                popupCaption,
                openModal,
                userId, // Передаем ID пользователя в createCard
                deleteCard, // Передаем функцию удаления карточки
                toggleLike
            );
            placesList.prepend(newCard);  // Добавляем карточку в начало списка
            closeModal(cardPopup);  // Закрываем попап после добавления
            cardForm.reset();  // Очищаем форму
        })
        .catch(err => {
            console.error('Ошибка при добавлении карточки:', err);
        })
        .finally(() => {
            toggleSubmitButtonState(submitButton, false);
        });
});



addCardButton.addEventListener('click', () => {
    cardForm.reset();
    openModal(cardPopup);
});

profileCloseButton.addEventListener('click', () => closeModal(profilePopup));
cardCloseButton.addEventListener('click', () => closeModal(cardPopup));
imagePopupCloseButton.addEventListener('click', () => closeModal(imagePopup));
avatarCloseButton.addEventListener('click', () => closeModal(avatarPopup));

popups.forEach((popup) => {
    popup.addEventListener('mousedown', closePopupOnOverlayClick);
});

document.addEventListener('DOMContentLoaded', () => {
    // Скрываем блок профиля на время загрузки данных с сервера
    const profileImage = document.querySelector('.profile__image');
    const profileTitle = document.querySelector('.profile__title');
    const profileDescription = document.querySelector('.profile__description');
    
    profileTitle.style.visibility = 'hidden';
    profileDescription.style.visibility = 'hidden';
    profileImage.style.validationSettings = 'hidden';

    getProfile()
        .then(data => {
            // После получения данных с сервера показываем имя и описание
            profileTitle.textContent = data.name;
            profileDescription.textContent = data.about;
            profileImage.style.backgroundImage = `url(${data.avatar})`;
            profileTitle.style.visibility = 'visible';
            profileDescription.style.visibility = 'visible';
            profileImage.style.visibility = 'visible';
        })
        .catch(err => {
            console.error('Ошибка при загрузке данных профиля:', err);
        });

    // Включаем валидацию
    enableValidation(validationSettings);

    // Рендерим карточки с сервера
    renderCardsFromServer();
});