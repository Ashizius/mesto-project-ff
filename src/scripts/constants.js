//объект, задающий классы модальных окон
export const modalClasses = {
  general: 'popup',
  animated: 'popup_is-animated',
  activated: 'popup_is-opened',
  closeButton: 'popup__close',
  savingMessage: 'Сохранение...',
  removingMessage: 'Удаление...',
};
//объект, задающий классы карточек
export const cardClasses = {
  card: 'card',
  cardTitle: 'card__title',
  cardImage: 'card__image',
  cardDeleteButton: 'card__delete-button',
  cardLikeButton: 'card__like-button',
  cardLiked: 'card__like-button_is-active',
  cardCounter: 'card__like-counter'
};
//объект настроек форм
export const formSettings = {
  formSelector: '.popup__form',
  inputSelector: '.popup__input',
  submitButtonSelector: '.popup__button',
  inactiveButtonClass: 'popup__button_disabled',
  inputErrorClass: 'popup__input_type_error',
  errorClass: 'popup__error_visible'
}