import initialCards from './cards.js';
import {putCard,addCard,removeCard,likeCard,cardsList,showCardHandler} from './card.js';
import {showModalHandler} from './modal.js';
import '../pages/index.css';
let maxCards = 6; // максимальное число выводимых карточек

let limitcards = true;
let cardAmount = limitcards ? maxCards : initialCards.length + 1;
let addedCards = []; // массив выведенных на страницу карточек



// DOM узлы

const placesList = document.querySelector('.places__list');
const placesListClone = placesList.cloneNode(false); //чтобы сразу все карточки добавить одним скопом в DOM
const editButton = document.querySelector('.profile__edit-button');

//Вывести карточки на страницу
initialCards.forEach((card,index)=>{
  if (index<maxCards) { //лимит в 6 карточек
    putCard(placesListClone,card,removeCard,likeCard,showCardHandler); 
  }
});
placesList.replaceWith(placesListClone); //сразу размещается весь узел с карточками, чтобы не по одной




//обработчики оверлеев
document.addEventListener('click',showModalHandler);
//popup.show('.popup_type_new-card');
//console.log(popup.current);
