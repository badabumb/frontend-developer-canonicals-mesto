// validate.js

// Функция отображения ошибок
export function showError(inputElement, errorElement, settings) {
    if (!inputElement.validity.valid || inputElement.value.trim() === '') {
        errorElement.textContent = inputElement.validationMessage || 'Поле не может быть пустым';
        inputElement.classList.add(settings.inputErrorClass);
    } else {
        errorElement.textContent = '';
        inputElement.classList.remove(settings.inputErrorClass);
    }
}

// Функция управления состоянием кнопки
export function toggleButtonState(form, button, settings) {
    button.disabled = !form.checkValidity();
    if (form.checkValidity()) {
        button.classList.remove(settings.inactiveButtonClass);
    } else {
        button.classList.add(settings.inactiveButtonClass);
    }
}

// Функция для добавления обработчиков событий
export function setEventListeners(formElement, settings) {
    const inputs = Array.from(formElement.querySelectorAll(settings.inputSelector));
    const submitButton = formElement.querySelector(settings.submitButtonSelector);

    inputs.forEach(input => {
        const errorElement = formElement.querySelector(`.${input.id}-error`);
        if (!input.validity.valid) {
            showError(input, errorElement, settings);
        }
        input.addEventListener('input', () => {
            showError(input, errorElement, settings);
            toggleButtonState(formElement, submitButton, settings);
        });
    });

    // Начальная установка состояния кнопки
    toggleButtonState(formElement, submitButton, settings);
}

// Функция для включения валидации
export function enableValidation(settings) {
    const forms = Array.from(document.querySelectorAll(settings.formSelector));

    forms.forEach(form => {
        setEventListeners(form, settings);
    });
}