import { showModalHandler } from './modal.js';
import { cardRules } from './index.js';
/*
модуль требует на вход две переменных:
show -- функция, которая выводит изображение в модальное окно, входным параметром функции является DOM элемент модального окна
cardRules -- объект со следующими свойствами:
  .cardTemplate -- темплейт карточки
  .container -- контейнер карточек
  .list [] -- список всех выведенных карточек
*/

// Функция удаления карточки
const removeCard = function (evt) {
  if (evt.target.classList.contains(cardRules.classes.cardDeleteButton)) {
    const cardElement=evt.currentTarget;
    const imageLink = cardElement.querySelector('.' + cardRules.classes.cardImage).src;
    cardRules.list.splice(
      cardRules.list.find((item) => item.link === imageLink),
      1
    );
    console.log(cardRules.list);
    cardElement.removeEventListener('click', removeCard);
    cardElement.removeEventListener('click', cardRules.showCardHandler);
    cardElement.removeEventListener('click', likeCard);
    evt.target.closest('.' + cardRules.classes.card).remove();
  }
};

const likeCard = function (evt) {
  if (evt.target.classList.contains(cardRules.classes.cardLikeButton)) {
    evt.target.classList.toggle(cardRules.classes.cardLiked); //переключение лайка
  }
};
// Функция создания элемента карточки
const createCard = function (card, removeCard, likeCard, showCardHandler) {
  const cardElement = cardRules.cardTemplate
    .querySelector('.' + cardRules.classes.card)
    .cloneNode(true);
  const cardImage = cardElement.querySelector('.' + cardRules.classes.cardImage);
  const cardTitle = cardElement.querySelector('.' + cardRules.classes.cardTitle);
  const cardDeleteButton = cardElement.querySelector(
    '.' + cardRules.classes.cardDeleteButton
  );
  const cardLikeButton = cardElement.querySelector(
    '.' + cardRules.classes.cardLikeButton
  );
  cardImage.src = card.link;
  cardImage.alt = 'фотография с изображением места ' + card.name;
  cardTitle.textContent = card.name;
  cardElement.addEventListener('click', showCardHandler);
  cardElement.addEventListener('click', removeCard);
  cardElement.addEventListener('click', likeCard);
  return cardElement;
};
//разместить карточки в контейнере
const putCard = function (
  cardDescription,
  createCard,
  removeCard,
  likeCard,
  showCardHandler
) {
  cardRules.container.prepend(
    createCard(cardDescription, removeCard, likeCard, showCardHandler)
  );
  cardRules.list.push(cardDescription);
};


//показ карточки по клику


//экспорт соответствующих функций
export { putCard, createCard, likeCard, removeCard };
