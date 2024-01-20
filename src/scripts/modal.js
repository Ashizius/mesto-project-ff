import { modalClasses } from './constants.js';

//функция закрытия модального окна, принимает на вход DOM-элемент модального окна и обработчик закрытия
const hideModal = (popup, handleClose) => {
  popup.classList.remove(modalClasses.activated);
  popup.removeEventListener('click', handleClose);
  document.removeEventListener('keydown', handleClose);
};

//функция отображения модального окна, принимает на вход DOM-элемент модального окна и обработчик закрытия
const showModal = (popup, handleClose) => {
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
  popup.addEventListener('click', handleClose);
  document.addEventListener('keydown', handleClose);
};

//функция, которая получает модальное окно с правилами взаимодействия по классу вызывающего его элемента
const getModal = (modalRules, element) => {
  return modalRules.find(
    (item) =>
      element.classList.contains(item.activator) || element === item.popup
  );
};

//функция, которая ищет среди модальных окон открытое
const getActiveModal = (modalRules) => {
  return modalRules.find((item) =>
    item.popup.classList.contains(modalClasses.activated)
  );
};

//экспорт соответствующих функций
export { showModal, hideModal, getModal, getActiveModal };
