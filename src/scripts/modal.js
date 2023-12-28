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
import {addCard} from './card.js';

/*let closeModal;*/

const closeHandler = function (evt) {
  if (((evt.type === 'click') && (evt.target.classList.contains('popup') || evt.target.classList.contains('popup__close')))||(evt.key === 'Escape')) {
    console.log(show.closeModal);
    show.closeModal();
  }
  /*else if (evt.key === 'Escape') {
    close(evt.target);
  }*/
  else {return;}
}

const submitHandler = function (evt) {
  //  addCard(); 
}

const saveHandler = function (evt) {
  /**/
}

const show = function (popup) {
    popup.style.display = 'flex';
    popup.addEventListener('click',closeHandler);
    document.addEventListener('keydown',closeHandler);
    if (popup.classList.contains('popup_type_edit')||popup.classList.contains('popup_type_new-card')) { //проверка является ли окном ввода
      popup.querySelector('.popup__button').addEventListener('click',submitHandler);
      popup.querySelector('.popup__button').addEventListener('keydown',submitHandler);
    }
    return function () {
      popup.removeEventListener('click',closeHandler);
      document.removeEventListener('keydown',closeHandler);
      if (popup.classList.contains('popup_type_edit')||popup.classList.contains('popup_type_new-card')) { //проверка является ли окном ввода
        popup.querySelector('.popup__button').removeEventListener('click',submitHandler);
        popup.querySelector('.popup__button').removeEventListener('keydown',submitHandler);
      }
      popup.style.display = 'none';
    }
  }

const showModalHandler = function (evt) {
  //if (currentModal) {return;}//если уже открыто модальное окно, то не делать ничего
  let modal;
  if (evt.target.classList.contains('profile__edit-button')) {
    modal=document.querySelector('.popup_type_edit');
    const name=document.querySelector('.profile .profile__title').textContent;
    const description=document.querySelector('.profile .profile__description').textContent;
    document.forms['edit-profile'].elements.name.value=name;
    document.forms['edit-profile'].elements.description.value=description;
  }
  else if (evt.target.classList.contains('profile__add-button')) {
    modal=document.querySelector('.popup_type_new-card');
  }
  else {return;}
  show.closeModal=show(modal);
  console.log(show.closeModal);
}


export {showModalHandler,show};

