import initialCards from './cards.js';
import '../pages/index.css';
let maxCards = 6; // максимальное число выводимых карточек
let limitcards = true;
let cardAmount = limitcards ? maxCards : initialCards.length + 1;

// DOM узлы
const cardTemplate = document.querySelector('#card-template').content; // Темплейт карточки
const placesList = document.querySelector('.places__list');

//объект, задающий модальные окна
const modalRules = {
  list: [
    {
      activator: 'profile__edit-button',
      popup: document.querySelector('.popup_type_edit'),
      form: document.forms['edit-profile'],
      set: () => {
        document.forms['edit-profile'].elements.name.value =
          document.querySelector('.profile .profile__title').textContent;
        document.forms['edit-profile'].elements.description.value =
          document.querySelector('.profile .profile__description').textContent;
      },
      get: () => {
        document.querySelector('.profile .profile__title').textContent =
          document.forms['edit-profile'].elements.name.value;
        document.querySelector('.profile .profile__description').textContent =
          document.forms['edit-profile'].elements.description.value;
      },
    },
    {
      activator: 'profile__add-button',
      popup: document.querySelector('.popup_type_new-card'),
      form: document.forms['new-place'],
      set: () => {
        return;
      }, //пустая функция для сохранения единообразия
      get: () =>
        putCard(
          {
            name: document.forms['new-place'].elements['place-name'].value,
            link: document.forms['new-place'].elements['link'].value,
          },
          createCard,
          removeCard,
          likeCard,
          showCardHandler
        ),
    },
  ],
  classes: {
    general: 'popup',
    animated: 'popup_is-animated',
    activated: 'popup_is-opened',
    closeButton: 'popup__close',
  },
};
//объект, задающий модальное окно карточки
const cardRules = {
  activator: 'card__image',
  card: 'card',
  cardTitle: 'card__title',
  cardImage: 'card__image',
  cardDeleteButton: 'card__delete-button',
  cardLikeButton: 'card__like-button',
  popup: document.querySelector('.popup_type_image'),
  popupImage: document.querySelector('.popup_type_image .popup__image'),
  popupCaption: document.querySelector('.popup_type_image .popup__caption'),
  cardTemplate: cardTemplate,
  container: placesList,
  list: [], //хранение списка выведенных карточек
};
// экспорт объектов, отвечающих за модальные окна в другие модули
export { cardRules, modalRules };
//импорт функций поведения карточек
import {
  putCard,
  createCard,
  likeCard,
  removeCard,
  showCardHandler,
} from './card.js';
//импорт функции слежения за открытием модального окна
import { showModalHandler } from './modal.js';

//Вывести карточки на страницу
const initializeCards = function (cardsList) {
  //вывод карточек в контейнер
  cardsList.forEach((card, index) => {
    if (index < maxCards) {
      //лимит в 6 карточек
      putCard(card, createCard, removeCard, likeCard, showCardHandler);
    }
  });
};

initializeCards(initialCards);

//обработчики оверлеев
document.addEventListener('click', showModalHandler);
