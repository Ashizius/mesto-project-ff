/*const modalActions ={
  profile: {
  action:'profile__edit-button',
  result:'.popup_type_edit',
  button:'.popup__button',
  name:'profile'
  type: 'submit'
  },
  cardAdd: {
  action:'profile__add-button',
  result:'.popup_type_new-card',
  button:'.popup__button',
  name:'cardAdd',
  type: 'submit'
  },
  view: {
  action:'card__image',
  result:'.popup_type_image',
  subelement:'.popup__image',
  name: 'view',
  type: 'view'
  }}; //соответствие классов актуаторов и классов попапов, чтобы меньше путаницы, что, к чему относится
let currentModal; //текущее открытое окно
let currentModalType; //его свойства
*/
//import {putCard,removeCard,likeCard,showCardHandler} from './card.js';
import {modalRules} from './index.js';
/*let closeModal;*/

const getModal = function(element) {
  return modalRules.list.find((item) => (element.classList.contains(item.activator)||(element===item.popup)))
  //return modalRules.list.find((item) => element.classList.contains(item.activator))
}

const hideModal = function () {
  const popup=document.querySelector('.'+modalRules.classes.activated);
  const closeButton=document.querySelector('.'+modalRules.classes.closeButton);
  closeButton.removeEventListener('click',hideHandler);
  document.removeEventListener('keydown',hideHandler);
  if (modalRules.list.some((item)=>popup.classList.contains(item))) { //проверка является ли окном ввода
    popup.querySelector('.'+modalRules.classes.submitButton).addEventListener('click',submitHandler);
    popup.querySelector('.'+modalRules.classes.submitButton).addEventListener('keydown',submitHandler);
  }
  popup.classList.remove(modalRules.classes.activated);
}

const hideHandler = function (evt) {
  if (((evt.type === 'click') && (evt.target.classList.contains(modalRules.classes.general) || evt.target.classList.contains(modalRules.classes.closeButton)))||(evt.key === 'Escape')) {
    hideModal();
  }
  else {return;}
}

const submitHandler = function (evt) {
  evt.preventDefault()
  const modal=getModal(evt.target.closest('.' + modalRules.classes.general));
  modal.get();
  hideModal();
  modal.form.reset();
}

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
  //if (modalRules.list.some((item)=>(popup.classList.contains(item.activator)&&item.form))) { //проверка, является ли окном ввода
  if (modalRules.list.some((item)=>item.form&&(popup===item.popup))) { //проверка, является ли окном ввода  
    popup.querySelector('.'+modalRules.classes.submitButton).addEventListener('click',submitHandler);
    popup.querySelector('.'+modalRules.classes.submitButton).addEventListener('keydown',submitHandler);
  }
}
/*
const fillForm(values,direction) function {
  if (!values||values.length===0) {return;}
  if (direction) {
    values.forEach((item)=>item.to.value=item.from.textContent);
  }
  else {
    values.forEach((item)=>item.from.textContent=item.to.value);
  }
}
  */
const showModalHandler = function (evt) {
  const modal=getModal(evt.target);
  if (modal) {
    if (modal.form) {modal.set()} //в данном проекте изображения обрабатываются другой функцией, но вдруг это будет не форма и не изображение
    show(modal.popup);
  }
}


export {showModalHandler,show};

