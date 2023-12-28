
import { show } from './modal.js';
import {cardRules} from './index.js';

// Функция удаления карточки
const removeCard = function (evt) {
  const imageLink = evt.target.closest('.card').querySelector('.card__image').src;
  cardRules.list.splice(cardRules.list.find((item) => item.link === imageLink),1);
  evt.target.removeEventListener('click', removeCard);
  evt.target.closest('.card').remove();
};

const likeCard = function (evt) {
  evt.target.classList.toggle('card__like-button_is-active'); //переключение лайка
};
// Функция создания элемента карточки
const createCard = function (card,removeCard,likeCard,showCardHandler) {
  const cardElement = cardRules.cardTemplate.querySelector('.card').cloneNode(true);
  const cardImage = cardElement.querySelector('.card__image');
  const cardTitle = cardElement.querySelector('.card__title');
  const cardDeleteButton = cardElement.querySelector('.card__delete-button');
  const cardLikeButton = cardElement.querySelector('.card__like-button');
  cardImage.src = card.link;
  cardImage.alt = 'фотография с изображением места ' + card.name;
  cardTitle.textContent = card.name;
  cardImage.addEventListener('click', showCardHandler);
  cardDeleteButton.addEventListener('click', removeCard);
  cardLikeButton.addEventListener('click', likeCard);
  return cardElement;
};
//разместить карточки в контейнере
const putCard = function (cardDescription,removeCard,likeCard,showCardHandler) {
  cardRules.container.prepend(createCard(cardDescription,removeCard,likeCard,showCardHandler));
  cardRules.list.push(cardDescription);
};

const imageCopy = function(img1,img2) {
    img1.src = img2.src;
    img1.alt = img2.alt;
}

const showCardHandler = function (evt) { //показ карточки по клику
  if (evt.target.classList.contains(cardRules.activator)) {
    if (cardRules.popupImage)
    imageCopy(cardRules.popupImage, evt.target);
    show(cardRules.popup);
  }
};

export {putCard,createCard,likeCard,removeCard,showCardHandler};

/*
//получить уникальную случайную карточку:
const getRandomCard = function (cardsList,addedCards) {
  const cardAmount=cardsList.length+1;
  let randomCard = cardsList[Math.floor(Math.random() * (cardAmount - 1))]; //случайная карточка
  //проверка на уникальность ↓
  if (
    addedCards.some(
      (card) => randomCard.name === card.name && randomCard.link === card.link
    )
  ){
    randomCard = getRandomCard(); //если уже есть в массиве, то взять другую случайную карточку
  }
  //конец проверки на уникальность ↑
  return randomCard;
};

// Функция перемешивания карточек
const shuffleCards = (initialList,cardsLimit,random) =>
{
  const newList=[];
  for (let index=0;index<Math.min(initialList.length,cardsLimit),index++){
    newList.push(random ? getRandomCard(initialList,newList) : initialList[index]);
  } //не map по причине ограничения количества карточек
  return newList;
}
*/
/*
shuffleCards(initialCards,maxCards);*/
