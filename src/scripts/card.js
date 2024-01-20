import { cardClasses } from './constants.js';

// Функция удаления карточки
const deleteCard = ({
  handleLike,
  handleShow,
  handleDelete,
  element,
  cardLike,
  cardImage,
  cardTrash,
}) => {
  cardLike.removeEventListener('click', handleLike);
  cardImage.removeEventListener('click', handleShow);
  cardTrash.removeEventListener('click', handleDelete);
  element.remove();
};

// Функция создания элемента карточки
export const createCard = (
  card,
  { cardTemplate, removeCard, likeCard, showCard, currentUser }
) => {
  const cardElement = cardTemplate
    .querySelector('.' + cardClasses.card)
    .cloneNode(true);
  const cardImage = cardElement.querySelector('.' + cardClasses.cardImage);
  const cardTitle = cardElement.querySelector('.' + cardClasses.cardTitle);
  const cardTrash = cardElement.querySelector(
    '.' + cardClasses.cardDeleteButton
  );
  const cardLike = cardElement.querySelector('.' + cardClasses.cardLikeButton);
  const cardCounter = cardElement.querySelector('.' + cardClasses.cardCounter);
  cardImage.src = card.link;
  cardImage.alt = 'фотография с изображением места ' + card.name;
  cardTitle.textContent = card.name;
  if (card.owner._id !== currentUser._id) {
    cardTrash.remove();
  }
  if (card.likes.some((like) => like._id === currentUser._id)) {
    cardLike.classList.add(cardClasses.cardLiked);
  }
  likeCard(cardLike, cardCounter, card, null);

  //обработчик клика по карточке, уникальный для каждой карточки:
  const handleLike = () => {
    likeCard(cardLike, cardCounter, card, currentUser._id);
  };
  const handleShow = () => {
    showCard(cardTitle, cardImage);
  };
  const handleDelete = () => {
    removeCard(card, deleteCard, {
      handleLike,
      handleShow,
      handleDelete,
      element: cardElement,
      cardLike,
      cardImage,
      cardTrash,
    });
  };
  cardLike.addEventListener('click', handleLike);
  cardImage.addEventListener('click', handleShow);
  cardTrash.addEventListener('click', handleDelete);
  return cardElement;
};
