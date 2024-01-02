import { show } from './modal.js';
import { cardRules } from './index.js';
/*
модуль требует на вход две переменных:
show -- функция, которая выводит изображение в модальное окно, входным параметром функции является DOM элемент модального окна
cardRules -- объект со следующими свойствами:
  .activator -- имя класса, вызывающего появление модального окна
  .popup -- DOM элемент модального окна с изображением
  .popupImage -- DOM элемент самого изображения внутри модального окна
  .popupCaption -- DOM элемент имени изображения внутри модального окна
  .cardTemplate -- темплейт карточки
  .container -- контейнер карточек
  .list [] -- список всех выведенных карточек
*/

// Функция удаления карточки
const removeCard = function (evt) {
  const imageLink = evt.target
    .closest('.' + cardRules.card)
    .querySelector('.' + cardRules.cardImage).src;
  cardRules.list.splice(
    cardRules.list.find((item) => item.link === imageLink),
    1
  );
  evt.target.removeEventListener('click', removeCard);
  evt.target.closest('.' + cardRules.card).remove();
};

const likeCard = function (evt) {
  evt.target.classList.toggle('card__like-button_is-active'); //переключение лайка
};
// Функция создания элемента карточки
const createCard = function (card, removeCard, likeCard, showCardHandler) {
  const cardElement = cardRules.cardTemplate
    .querySelector('.' + cardRules.card)
    .cloneNode(true);
  const cardImage = cardElement.querySelector('.' + cardRules.cardImage);
  const cardTitle = cardElement.querySelector('.' + cardRules.cardTitle);
  const cardDeleteButton = cardElement.querySelector(
    '.' + cardRules.cardDeleteButton
  );
  const cardLikeButton = cardElement.querySelector(
    '.' + cardRules.cardLikeButton
  );
  cardImage.src = card.link;
  cardImage.alt = 'фотография с изображением места ' + card.name;
  cardTitle.textContent = card.name;
  cardImage.addEventListener('click', showCardHandler);
  cardDeleteButton.addEventListener('click', removeCard);
  cardLikeButton.addEventListener('click', likeCard);
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
//копирование свойств изображения
const imageCopy = function (img1, img2) {
  img1.src = img2.src;
  img1.alt = img2.alt;
};
//копирование jgbcfybz изображения
const captionCopy = function (elem1, elem2) {
  elem1.textContent = elem2.textContent;
};

//показ карточки по клику
const showCardHandler = function (evt) {
  if (evt.target.classList.contains(cardRules.activator)) {
    imageCopy(cardRules.popupImage, evt.target);
    captionCopy(
      cardRules.popupCaption,
      evt.target
        .closest('.' + cardRules.card)
        .querySelector('.' + cardRules.cardTitle)
    );
    show(cardRules.popup);
  }
};

//экспорт соответствующих функций
export { putCard, createCard, likeCard, removeCard, showCardHandler };
