import { cardClasses } from './constants.js';

// Функция удаления карточки
const removeCard = function (cardElement) {
  cardElement.remove();
};

//функция лайка карточки
const likeCard = function (cardLikeButton) {
  cardLikeButton.classList.toggle(cardClasses.cardLiked); //переключение лайка
};

// Функция создания элемента карточки
const createCard = function (
  card,
  cardTemplate,
  removeCard,
  likeCard,
  showCard
) {
  const cardElement = cardTemplate
    .querySelector('.' + cardClasses.card)
    .cloneNode(true);
  const cardImage = cardElement.querySelector('.' + cardClasses.cardImage);
  const cardTitle = cardElement.querySelector('.' + cardClasses.cardTitle);
  const cardLikeButton = cardElement.querySelector(
    '.' + cardClasses.cardLikeButton
  );
  cardImage.src = card.link;
  cardImage.alt = 'фотография с изображением места ' + card.name;
  cardTitle.textContent = card.name;
  //обработчик клика по карточке, уникальный для каждой карточки:
  const handleCardClick = function (evt) {
    const classList = evt.target.classList;
    if (classList.contains(cardClasses.cardImage)) {
      showCard(cardTitle, cardImage);
    } else if (classList.contains(cardClasses.cardLikeButton)) {
      likeCard(cardLikeButton);
    } else if (classList.contains(cardClasses.cardDeleteButton)) {
      cardElement.removeEventListener('click', handleCardClick);
      removeCard(cardElement);
    }
  };
  cardElement.addEventListener('click', handleCardClick);
  return cardElement;
};

//экспорт соответствующих функций
export { createCard, likeCard, removeCard };
