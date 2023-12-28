import initialCards from './cards.js';
import '../pages/index.css';
let maxCards = 6; // максимальное число выводимых карточек
let limitcards = true;
let cardAmount = limitcards ? maxCards : initialCards.length + 1;


// DOM узлы
const editButton = document.querySelector('.profile__edit-button');
const cardTemplate = document.querySelector('#card-template').content; // Темплейт карточки
const placesList = document.querySelector('.places__list');

const modalRules={
  list:[
    {
      activator:'profile__edit-button',
      popup:document.querySelector('.popup_type_edit'),
      form: document.forms['new-place'],
      set: () => {
        document.forms['edit-profile'].elements.name.value=document.querySelector('.profile .profile__title').textContent;
        document.forms['edit-profile'].elements.description.value=document.querySelector('.profile .profile__description').textContent;
      },
      get: () => {
        document.querySelector('.profile .profile__title').textContent=document.forms['edit-profile'].elements.name.value;
        document.querySelector('.profile .profile__description').textContent=document.forms['edit-profile'].elements.description.value;
      }
    },
    {
      activator:'profile__add-button',
      popup:document.querySelector('.popup_type_new-card'),
      form:document.forms['new-place'],
      set: () => {return;}, //пустая функция для сохранения единообразия
      get: () => putCard({name: document.forms['new-place'].elements['place-name'].value, link:document.forms['new-place'].elements['link'].value},removeCard,likeCard,showCardHandler)
    }
  ],
  classes:
  {
    general: 'popup',
    animated: 'popup_is-animated',
    activated: 'popup_is-opened',
    closeButton: 'popup__close',
    submitButton: 'popup__button'
  }
};//переменная, задающая поведение модальных окон
const cardRules={
  activator: 'card__image',
  popup: document.querySelector('.popup_type_image'),
  popupImage: document.querySelector('.popup_type_image .popup__image'),
  cardTemplate: cardTemplate,
  container: placesList,
  list: [] //хранение списка выведенных карточек
} 

// массив выведенных на страницу карточек


export {cardRules, modalRules}
import {putCard,removeCard,likeCard,cardsList,showCardHandler} from './card.js';
import {showModalHandler} from './modal.js';
//Вывести карточки на страницу

const initializeCards = function (cardsList) { //вывод карточек в контейнер
  cardsList.forEach((card,index)=>{
  if (index<maxCards) { //лимит в 6 карточек
    putCard(card,removeCard,likeCard,showCardHandler); 
  }
});
}

initializeCards(initialCards);

//обработчики оверлеев
document.addEventListener('click',showModalHandler);
//popup.show('.popup_type_new-card');
//console.log(popup.current);
