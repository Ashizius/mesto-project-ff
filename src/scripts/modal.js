import { modalRules } from './index.js';

/*
модуль требует на вход объект:
modalRules -- объект, содержащий описание модальных окон, содержит:
  .list -- массив модальных окон, 
  каждое модальное окно в массиве описывается объектом со свойствами:
    .activator -- имя класса, по нажатию на элемент которого отображается модальное окно
    .popup -- DOM-элемент самого модального окна
    .form -- если модальное окно содержит форму, то указывается DOM-элемент формы
    .setup -- если модальное окно содержит форму, то указывается функция, по которой будет заполнено модальное окно при появлении и сбросе
    .submit -- если модальное окно содержит форму, то указывается функция, которая будет выполнена при отправке формы
  помимо массива указывается объект, содержащий имена классов для взаимодействия с модальным окном
    general -- общее имя класса для модального окна
    animated -- имя класса для анимирования модального окна
    activated -- имя класса для открытого модального окна
    closeButton -- имя класса кнопки закрытия модального окна
  }
*/

//функция, получающая параметры модального окна из объекта modalRules, на вход подаётся DOM-элемент
const getModal = function (element) {
  return modalRules.list.find(
    (item) =>
      element.classList.contains(item.activator) || element === item.popup
  );
};

const getActiveModal = function () {
  return modalRules.list.find(
    (item) =>
      item.popup.classList.contains(modalRules.classes.activated));
};

//функция закрытия модального окна
const hideModal = function (popup) {
  popup.classList.remove(modalRules.classes.activated);
  document.removeEventListener('click', hideHandler);
  document.removeEventListener('keydown', hideHandler);
};

// функция, вызываемая для закрытия модального окна и проверяющая, на правильное ли окно пришёл ивент
const hideHandler = function (evt) {
  if ((
    evt.type === 'click' &&
      (evt.target.classList.contains(modalRules.classes.general) ||
        evt.target.classList.contains(modalRules.classes.closeButton))) || (evt.key === 'Escape'))
  {
    const activeModal=getActiveModal();
    hideModal(activeModal.popup);
    if (activeModal.setup) {
      activeModal.setup();
    }
  }
};

//функция отображения модального окна, принимает на вход DOM-элемент модального окна
const showModal = function (popup) {
  if (!popup.classList.contains(modalRules.classes.animated)) {
    setTimeout(() => {
      popup.classList.add(modalRules.classes.animated);
    }, 0);
    setTimeout(() => {
      popup.classList.add(modalRules.classes.activated);
    }, 10);
  } else {
    popup.classList.add(modalRules.classes.activated);
  }
  document.addEventListener('click', hideHandler);
  document.addEventListener('keydown', hideHandler);
};

// функция, вызываемая для отображения модального окна и проверяющая, на правильное ли окно пришёл ивент
const showModalHandler = function (evt) {
  const modalRule = getModal(evt.target); // поиск окна по классу кнопки
  //if (modalRule && !(document.querySelector('.' + modalRules.classes.activated))) {
  if (modalRule && !(getActiveModal())) {//если найдено окно и нет уже открытого
    showModal(modalRule.popup);
  }
};
//экспорт соответствующих функций
export {showModalHandler, hideModal};
