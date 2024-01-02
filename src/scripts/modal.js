
import {modalRules} from './index.js';

/*
модуль требует на вход один объект:
modalRules -- объект, содержащий описание модальных окон, содержит:
  .list -- массив модальных окон, 
  каждое модальное окно в массиве описывается объектом со свойствами:
    .activator -- имя класса, по нажатию на элемент которого отображается модальное окно
    .popup -- DOM-элемент самого модального окна
    .form -- если модальное окно содержит форму, то указывается DOM-элемент формы
    .set -- если модальное окно содержит форму, то указывается функция, по которой будет заполнено модальное окно при появлении
    .get -- если модальное окно содержит форму, то указывается функция, которая будет выполнена при отправке формы
  помимо массива указывается объект, содержащий имена классов для взаимодействия с модальным окном
    general -- общее имя класса для модального окна
    animated -- имя класса для анимирования модального окна
    activated -- имя класса для открытого модального окна
    closeButton -- имя класса кнопки закрытия модального окна
    submitButton -- имя класса кнопки отправки формы
  }
*/


//функция, получающая параметры модального окна из объекта modalRules, на вход подаётся DOM-элемент
const getModal = function(element) {
  return modalRules.list.find((item) => (element.classList.contains(item.activator)||(element===item.popup)))
}

//функция закрытия модального окна
const hideModal = function () {
  const popup=document.querySelector('.'+modalRules.classes.activated);
  const closeButton=document.querySelector('.'+modalRules.classes.closeButton);
  closeButton.removeEventListener('click',hideHandler);
  document.removeEventListener('keydown',hideHandler);
  const modal=getModal(popup);
  if (modal) { //проверка является ли окном ввода
    if (modal.form) {
      modal.form.removeEventListener('submit',submitHandler);
    }
  }
  popup.classList.remove(modalRules.classes.activated);
}

// функция, вызываемая для закрытия модального окна и проверяющая, на правильное ли окно пришёл ивент
const hideHandler = function (evt) {
  if (((evt.type === 'click') && (evt.target.classList.contains(modalRules.classes.general) || evt.target.classList.contains(modalRules.classes.closeButton)))||(evt.key === 'Escape')) {
    hideModal();
  }
  else {return;}
}
//функция, следящая за отправкой формы
const submitHandler = function (evt) {
  evt.preventDefault()
  const modal=getModal(evt.target.closest('.' + modalRules.classes.general));
  modal.get();
  hideModal();
  modal.form.reset();
}
//функция отображения модального окна, принимает на вход DOM-элемент модального окна
const show = function (popup) {
  if (!popup.classList.contains(modalRules.classes.animated)){
    setTimeout(()=>{popup.classList.add(modalRules.classes.animated);},0); 
    setTimeout(()=>{popup.classList.add(modalRules.classes.activated);},10);
  }
  else {
    popup.classList.add(modalRules.classes.activated);
  }
  popup.addEventListener('click',hideHandler);
  document.addEventListener('keydown',hideHandler);
}


// функция, вызываемая для отображения модального окна и проверяющая, на правильное ли окно пришёл ивент
const showModalHandler = function (evt) {
  const modal=getModal(evt.target);
  if (modal) {
    if (modal.form) {
      modal.set();
      modal.form.addEventListener('submit',submitHandler);
    }
    show(modal.popup);
  }
}

//экспорт соответствующих функций
export {showModalHandler,show};

