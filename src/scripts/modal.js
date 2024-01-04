import { modalClasses } from './constants.js';

//функция закрытия модального окна, принимает на вход DOM-элемент модального окна и обработчик закрытия
const hideModal = function (popup, handleClose) {
  popup.classList.remove(modalClasses.activated);
  document.removeEventListener('click', handleClose);
  document.removeEventListener('keydown', handleClose);
};

//функция отображения модального окна, принимает на вход DOM-элемент модального окна и обработчик закрытия
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

//экспорт соответствующих функций
export { showModal, hideModal };
