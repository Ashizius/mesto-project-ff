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
import { createCard, likeCard, removeCard } from './card.js'; //импорт функций поведения карточек
import {
  showModal,
  hideModal,
  stopFormListening,
  startFormListening,
} from './modal.js'; //импорт функции открытия и закрытия модального окна, а также оперирование формами
import { modalClasses } from './constants.js'; //импорт классов модальных окон

//функции сброса и отправки формы редактирования профиля
const setupProfile = function () {
  formEdit.elements.name.value = profileName.textContent;
  formEdit.elements.description.value = profileDescription.textContent;
};
const submitProfile = function (evt) {
  evt.preventDefault();
  profileName.textContent = formEdit.elements.name.value;
  profileDescription.textContent = formEdit.elements.description.value;
};
//функции сброса и отправки формы создания карточки
const setupPlace = function () {
  formNewPlace.reset();
};
const submitPlace = function (evt) {
  evt.preventDefault();
  putCard(
    {
      name: formNewPlace.elements['place-name'].value,
      link: formNewPlace.elements['link'].value,
    },
    cardTemplate,
    placesList,
    createCard,
    removeCard,
    likeCard,
    showCard
  );
  formNewPlace.reset();
};

//собранные модальные окна в один объект
const modalRules = [
  {
    activator: 'profile__edit-button',
    popup: popupEdit,
    form: formEdit,
    setup: setupProfile,
    submit: submitProfile,
  },
  {
    activator: 'profile__add-button',
    popup: popupNewPlace,
    form: formNewPlace,
    setup: setupPlace,
    submit: submitPlace,
  },
  {
    activator: 'card__image',
    popup: popupCard,
  },
];

//копирование свойств изображения
const copyImage = function (img1, img2) {
  img1.src = img2.src;
  img1.alt = img2.alt;
};
//копирование описания изображения
const copyText = function (elem1, elem2) {
  elem1.textContent = elem2.textContent;
};
//функция показа карточки в элементе с текстовым блоком и изображением
const showCard = function (cardCaption, cardImage) {
  copyText(popupCardCaption, cardCaption);
  copyImage(popupCardImage, cardImage);
};

//размещение карточки в контейнере
const putCard = function (
  card,
  template,
  container,
  create,
  remove,
  like,
  show
) {
  container.prepend(create(card, template, remove, like, show));
};

//вывод карточек из массива
const initializeCards = function (
  cardsList,
  template,
  container,
  create,
  remove,
  like,
  show
) {
  cardsList.forEach((card) => {
    putCard(card, template, container, create, remove, like, show);
  });
};

//вызов функции вывода карточек на странице
initializeCards(
  initialCards,
  cardTemplate,
  placesList,
  createCard,
  removeCard,
  likeCard,
  showCard
);

//функция, которая получает модальное окно с правилами взаимодействия по классу вызывающего его элемента
const getModal = function (element) {
  return modalRules.find(
    (item) =>
      element.classList.contains(item.activator) || element === item.popup
  );
};

//слушатели действий с модальным окном
const handleModal = function (evt) {
  const modalRule = getModal(evt.target); // поиск окна по классу кнопки
  if (modalRule) {
    //если найдено окно
    const handleHide = function (evt) {
      //создание функции для слушателя закрытия модального окна
      if (
        (evt.type === 'click' &&
          (evt.target.classList.contains(modalClasses.general) ||
            evt.target.classList.contains(modalClasses.closeButton))) ||
        evt.key === 'Escape' ||
        evt.type === 'submit'
      ) {
        hideModal(modalRule.popup, handleHide);
        stopFormListening(modalRule, handleHide); //убрал в отдельную функцию, чтобы не увеличивать вложенность
      }
    };
    startFormListening(modalRule, handleHide); //слушатель сабмита и закрытия модального окна
    showModal(modalRule.popup, handleHide);
  }
};

//обработчики оверлеев
document.addEventListener('click', handleModal); //сразу на весь документ, чтобы уменьшить количество слушателей событий
