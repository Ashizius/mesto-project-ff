import { cardRules } from './index.js';
/*
модуль требует на вход объект
cardRules -- объект со следующими свойствами:
  .classes: -- список классов карточек
  .cardTemplate -- темплейт карточки
  .container -- контейнер карточек
  .list [] -- список всех выведенных карточек
*/

// Функция удаления карточки
const removeCard = function (cardElement, cardImage) {
  const imageLink = cardImage.src;
  cardRules.list.splice(
    cardRules.list.find((item) => item.link === imageLink),
    1
  );
  cardElement.remove();
};
//функция лайка карточки
const likeCard = function (cardLikeButton) {
  cardLikeButton.classList.toggle(cardRules.classes.cardLiked); //переключение лайка
};
// Функция создания элемента карточки
const createCard = function (card, removeCard, likeCard, showCard) {
  const cardElement = cardRules.cardTemplate
    .querySelector('.' + cardRules.classes.card)
    .cloneNode(true);
  const cardImage = cardElement.querySelector(
    '.' + cardRules.classes.cardImage
  );
  const cardTitle = cardElement.querySelector(
    '.' + cardRules.classes.cardTitle
  );
  const cardLikeButton = cardElement.querySelector(
    '.' + cardRules.classes.cardLikeButton
  );
  cardImage.src = card.link;
  cardImage.alt = 'фотография с изображением места ' + card.name;
  cardTitle.textContent = card.name;
  //обработчик клика по карточке, уникальный для каждой карточки:
  const clickCardHandler = function (evt) {
    const classList = evt.target.classList;
    const classes = cardRules.classes;
    if (classList.contains(classes.cardImage)) {
      showCard(cardTitle, cardImage);
    } else if (classList.contains(classes.cardLikeButton)) {
      likeCard(cardLikeButton);
    } else if (classList.contains(classes.cardDeleteButton)) {
      cardElement.removeEventListener('click', clickCardHandler);
      removeCard(cardElement, cardImage);
    }
  };
  cardElement.addEventListener('click', clickCardHandler);
  return cardElement;
};
//разместить карточки в контейнере
const putCard = function (description, create, remove, like, show) {
  cardRules.container.prepend(create(description, remove, like, show));
  cardRules.list.push(description);
};

//экспорт соответствующих функций
export { putCard, createCard, likeCard, removeCard };
