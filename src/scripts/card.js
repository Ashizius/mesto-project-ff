import { cardClasses } from './constants.js';

// Функция удаления карточки
const deleteCard = function (cardElement,handler) {
  cardElement.remove();
  cardElement.removeEventListener('click', handler);
};

// Функция создания элемента карточки
export const createCard = function (
  card,
  cardTemplate,
  removeCard,
  likeCard,
  showCard,
  currentUser
) {
  const cardElement = cardTemplate
    .querySelector('.' + cardClasses.card)
    .cloneNode(true);
  const cardImage = cardElement.querySelector('.' + cardClasses.cardImage);
  const cardTitle = cardElement.querySelector('.' + cardClasses.cardTitle);
  const cardTrash = cardElement.querySelector('.' + cardClasses.cardDeleteButton);
  const cardLikeButton = cardElement.querySelector(
    '.' + cardClasses.cardLikeButton
  );
  const cardCounter = cardElement.querySelector('.' + cardClasses.cardCounter);
  cardImage.src = card.link;
  cardImage.alt = 'фотография с изображением места ' + card.name;
  cardTitle.textContent = card.name;
  if (card.owner._id!==currentUser._id) {
    cardTrash.remove();
  }
  if (card.likes.some((like) => like._id === currentUser._id)) {
    cardLikeButton.classList.add(cardClasses.cardLiked);
  }
  likeCard(cardLikeButton,cardCounter,card,null);
  
  //обработчик клика по карточке, уникальный для каждой карточки:
  const handleCardClick = function (evt) {
    const classList = evt.target.classList;
    if (classList.contains(cardClasses.cardImage)) {
      showCard(cardTitle, cardImage);
    } else if (classList.contains(cardClasses.cardLikeButton)) {
      likeCard(cardLikeButton,cardCounter,card,currentUser._id);
    } else if (classList.contains(cardClasses.cardDeleteButton)) {
      removeCard(cardElement,deleteCard,handleCardClick,card);
    }
  };
  cardElement.addEventListener('click', handleCardClick);
  return cardElement;
};

