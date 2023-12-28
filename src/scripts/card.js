const cardTemplate = document.querySelector('#card-template').content; // Темплейт карточки
const cardsList = [];
import { show } from './modal.js';



// Функция удаления карточки
const removeCard = function (event) {

  const imageLink = event.target.closest('.card').querySelector('.card__image').src;
  cardsList.splice(cardsList.find((item) => item.link === imageLink),1);
  event.target.removeEventListener('click', removeCard);
  event.target.closest('.card').remove();
};

const likeCard = function (event) {
  //event.target.closest('.card').remove(); поменять класс
};
// Функция создания элемента карточки
const createCard = function (card,removeCard,likeCard,showCardHandler) {
  const cardElement = cardTemplate.querySelector('.card').cloneNode(true);
  const cardImage = cardElement.querySelector('.card__image');
  const cardTitle = cardElement.querySelector('.card__title');
  const cardDeleteButton = cardElement.querySelector('.card__delete-button');
  ////const cardLikeButton = cardElement.querySelector('.card__delete-button');
  cardImage.src = card.link;
  cardImage.alt = 'фотография с изображением места ' + card.name;
  cardTitle.textContent = card.name;
  cardImage.addEventListener('click', showCardHandler);
  cardDeleteButton.addEventListener('click', removeCard);
  ////cardLikeButton.addEventListener('click', likeCard);
  return cardElement;
};
//разместить карточки в контейнере
const putCard = function (container,cardDescription,removeCard,likeCard,showCardHandler) {
  const cardElement = createCard(cardDescription,removeCard,likeCard,showCardHandler);
  container.append(cardElement);
  cardsList.push(cardDescription);
};

const addCard = function (container,cardDescription,removeCard,likeCard,showCardHandler) {
  const cardElement = createCard(cardDescription,removeCard,likeCard,showCardHandler);
  container.prepend(cardElement);
  cardsList.shift(cardDescription);
};

/*
const getCardsList = function (container) {
    return container.querySelectorAll('.card').reduce(prevItem,item => prevItem.push({name:item.querySelector('.card__title').textContent,link:item.querySelector('.card__image').src}),[])
}
*/

const showCardHandler = function (evt) {
  if (evt.target.classList.contains('card__image')) {
    const modal = document.querySelector('.popup_type_image');
    const image = modal.querySelector('.popup__image');
    image.src = evt.target.src;
    image.alt = evt.target.alt;
    show.closeModal=show(modal);
  }
};

export {putCard, addCard, removeCard, likeCard, cardsList, showCardHandler};

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
