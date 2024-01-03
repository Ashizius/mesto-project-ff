import { modalClasses } from './constants.js';

//функция закрытия модального окна
const hideModal = function (popup, handleClose) {
  popup.classList.remove(modalClasses.activated);
  document.removeEventListener('click', handleClose);
  document.removeEventListener('keydown', handleClose);
};

//функция отображения модального окна, принимает на вход DOM-элемент модального окна
const showModal = function (popup, handleClose) {
  if (!popup.classList.contains(modalClasses.animated)) {
    setTimeout(() => {
      popup.classList.add(modalClasses.animated);
    }, 0);
    setTimeout(() => {
      popup.classList.add(modalClasses.activated);
    }, 10);
  } else {
    popup.classList.add(modalClasses.activated);
  }
  document.addEventListener('click', handleClose);
  document.addEventListener('keydown', handleClose);
};

const stopFormListening = function (formObject, handleClose) {
  if (formObject.form) {
    formObject.form.removeEventListener('submit', formObject.submit);
    formObject.form.removeEventListener('submit', handleClose);
    formObject.setup();    
  }
};

const startFormListening = function (formObject, handleClose) {
  if (formObject.form) {
    formObject.setup();
    formObject.form.addEventListener('submit', formObject.submit);
    formObject.form.addEventListener('submit', handleClose);
  }
};

// функция, вызываемая для отображения модального окна и проверяющая, на правильное ли окно пришёл ивент

//экспорт соответствующих функций
export { showModal, hideModal, stopFormListening, startFormListening };
