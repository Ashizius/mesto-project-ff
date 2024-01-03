import '../pages/index.css'; //импорт CSS

// DOM узлы
const profileName = document.querySelector('.profile__info .profile__title');
const profileDescription = document.querySelector(
  '.profile__info .profile__description'
);
const popupEdit = document.querySelector('.popup_type_edit');
const popupNewPlace = document.querySelector('.popup_type_new-card');
const popupCard = document.querySelector('.popup_type_image');
const popupCardImage = document.querySelector(
  '.popup_type_image .popup__image'
);
const popupCardCaption = document.querySelector(
  '.popup_type_image .popup__caption'
);
const formEdit = document.forms['edit-profile'];
const formNewPlace = document.forms['new-place'];
const cardTemplate = document.querySelector('#card-template').content; // Темплейт карточки
const placesList = document.querySelector('.places__list');

import initialCards from './cards.js'; //импорт списка карточек
import { putCard, createCard, likeCard, removeCard } from './card.js'; //импорт функций поведения карточек
import { showModalHandler, hideModal } from './modal.js'; //импорт функции слежения за открытием модального окна
let maxCards = 6; // максимальное количество начальных карточек
let limitcards = true;
let cardAmount = limitcards ? maxCards : initialCards.length + 1;

//функции сброса и отправки формы редактирования профиля
const profileSetup = function () {
  formEdit.elements.name.value = profileName.textContent;
  formEdit.elements.description.value = profileDescription.textContent;
};
const profileSubmit = function (evt) {
  evt.preventDefault();
  profileName.textContent = formEdit.elements.name.value;
  profileDescription.textContent = formEdit.elements.description.value;
  hideModal(popupEdit);
};
//функции сброса и отправки формы создания карточки
const placeSetup = function () {
  formNewPlace.reset();
};
const placeSubmit = function (evt) {
  evt.preventDefault();
  putCard(
    {
      name: formNewPlace.elements['place-name'].value,
      link: formNewPlace.elements['link'].value,
    },
    createCard,
    removeCard,
    likeCard,
    showCard
  );
  hideModal(popupNewPlace);
  formNewPlace.reset();
};

//копирование свойств изображения
const imageCopy = function (img1, img2) {
  img1.src = img2.src;
  img1.alt = img2.alt;
};
//копирование описания изображения
const textCopy = function (elem1, elem2) {
  elem1.textContent = elem2.textContent;
};
//функция показа карточки в элементе с текстовым блоком и изображением
export const showCard = function (cardCaption, cardImage) {
  textCopy(popupCardCaption, cardCaption);
  imageCopy(popupCardImage, cardImage);
};

//объект, задающий модальные окна
export const modalRules = {
  list: [
    {
      activator: 'profile__edit-button',
      popup: popupEdit,
      form: formEdit,
      setup: profileSetup,
      submit: profileSubmit,
    },
    {
      activator: 'profile__add-button',
      popup: popupNewPlace,
      form: formNewPlace,
      setup: placeSetup,
      submit: placeSubmit,
    },
    {
      activator: 'card__image',
      popup: popupCard,
    },
  ],
  classes: {
    general: 'popup',
    animated: 'popup_is-animated',
    activated: 'popup_is-opened',
    closeButton: 'popup__close',
  },
};
//объект, задающий карточки
export const cardRules = {
  classes: {
    card: 'card',
    cardTitle: 'card__title',
    cardImage: 'card__image',
    cardDeleteButton: 'card__delete-button',
    cardLikeButton: 'card__like-button',
    cardLiked: 'card__like-button_is-active',
  },
  cardTemplate: cardTemplate,
  container: placesList,
  list: [], //хранение списка выведенных карточек
};

//Вывести карточки на страницу
const initializeCards = function (cardsList) {
  //вывод карточек в контейнер
  cardsList.forEach((card, index) => {
    if (index < cardAmount) {
      //лимит в 6 карточек
      putCard(card, createCard, removeCard, likeCard, showCard);
    }
  });
};
initializeCards(initialCards);

//обработчики оверлеев
document.addEventListener('click', showModalHandler); //сразу на весь документ, чтобы уменьшить количество слушателей событий

//назначение слушателей отправки форм
modalRules.list.forEach((item) => {
  if (item.form) {
    item.setup();
    item.form.addEventListener('submit', item.submit);
  }
});
