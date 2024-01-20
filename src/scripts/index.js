import '../pages/index.css'; //импорт CSS

// DOM узлы
const profileName = document.querySelector('.profile__info .profile__title');
const profileDescription = document.querySelector(
  '.profile__info .profile__description'
);
const profileAvatar = document.querySelector('.profile__image');

const popupEdit = document.querySelector('.popup_type_edit');
const popupNewPlace = document.querySelector('.popup_type_new-card');
const popupAvatar = document.querySelector('.popup_type_avatar');
const popupDeleteCard = document.querySelector('.popup_type_delete-card');
const popupCard = document.querySelector('.popup_type_image');
const popupCardImage = document.querySelector(
  '.popup_type_image .popup__image'
);
const popupCardCaption = document.querySelector(
  '.popup_type_image .popup__caption'
);

const formEdit = document.forms['edit-profile'];
const formNewPlace = document.forms['new-place'];
const formAvatar = document.forms['edit-avatar'];
const formDeleteCard = document.forms['delete-card'];
const cardTemplate = document.querySelector('#card-template').content; // Темплейт карточки
const placesList = document.querySelector('.places__list');

import { createCard } from './card.js'; //импорт функций поведения карточек
import { showModal, hideModal, getModal, getActiveModal } from './modal.js'; //импорт функции открытия и закрытия модального окна, а также оперирование формами
import { cardClasses, modalClasses, formSettings } from './constants.js'; //импорт классов модальных окон
import { clearValidation, enableValidation } from './validation.js'; //импорт классов модальных окон
import {
  getInitialCards,
  getProfileInfo,
  requestLikeCard,
  requestUnlikeCard,
  requestUpdateProfile,
  requestUpdateAvatar,
  requestPutCard,
  requestRemoveCard,
} from './api.js';
import { handleSubmit } from './utils.js';

let profileInfo;
let markedCard; //помеченная карта под удаление

//установка исходных данных о пользователе
const setupProfileInfo = (info) => {
  profileName.textContent = info.name;
  profileDescription.textContent = info.about;
  profileAvatar.style.backgroundImage = `url("${info.avatar}")`;
};

//функции сброса и отправки формы редактирования профиля
const setupProfile = () => {
  formEdit.elements.name.value = profileName.textContent;
  formEdit.elements.description.value = profileDescription.textContent;
  clearValidation(formEdit, formSettings);
};

const submitProfile = (profile) => {
  profileName.textContent = profile.name; //запись значения из ответа сервера
  profileDescription.textContent = profile.about; //запись значения из ответа сервера
  return { form: formEdit, name: profile.name, description: profile.about }; // передача объекта в следующий then для предзаполнения формы
};

//функция отправки формы редактирования аватара
const submitAvatar = (profile) => {
  profileAvatar.style.backgroundImage = `url("${profile.avatar}")`;
};

//функция отправки формы создания карточки
const submitPlace = (card) => {
  putCard(card);
};

//функция лайка карточки
const likeCard = (cardLikeButton, cardLikeCounter, card, userId) => {
  if (!userId) {
    cardLikeCounter.textContent = card.likes.length;
    return;
  } //Если не указан пользователь, то просто вывести количество лайков
  cardLikeCounter.textContent = '⌛️'; //выводит символ в количество лайков, на время получения ответа от сервера
  if (!cardLikeButton.classList.contains(cardClasses.cardLiked)) {
    requestLikeCard(card._id)
      .then((receivedCard) => {
        if (receivedCard.likes.some((like) => like._id === userId)) {
          //если пользователь среди тех, кто лайкнули, то добавить класс лайка карточки
          cardLikeButton.classList.add(cardClasses.cardLiked);
        }
        cardLikeCounter.textContent = receivedCard.likes.length;
      })
      .catch((err) => {
        console.error(err); //выводит сообщение об ошибке в консоль
        cardLikeCounter.textContent = '?'; //если ответ от сервера не получен, то неизвестно, какое количество лайков стало
      });
  } else {
    requestUnlikeCard(card._id)
      .then((receivedCard) => {
        if (!receivedCard.likes.some((like) => like._id === userId)) {
          cardLikeButton.classList.remove(cardClasses.cardLiked);
        }
        cardLikeCounter.textContent = receivedCard.likes.length;
      })
      .catch((err) => {
        console.error(err);
        cardLikeCounter.textContent = '?';
      });
  }
};

const removeCard = (card, remove, parameters) => {
  //данная функция вызывается при клике по корзине и помечает карточку под удаление, заодно так гарантируется, что удаляемая карточка единственная
  showModal(popupDeleteCard, handleHide);
  markedCard = {};
  markedCard.parameters = parameters;
  markedCard.remove = remove;
  markedCard.card = card;
};

const submitDeleteCard = () => {
  markedCard.remove(markedCard.parameters);
  return { form: formDeleteCard };
};

//копирование свойств изображения
const copyImage = (img1, img2) => {
  img1.src = img2.src;
  img1.alt = img2.alt;
};
//копирование описания изображения
const copyText = (elem1, elem2) => {
  elem1.textContent = elem2.textContent;
};
//функция показа карточки в элементе с текстовым блоком и изображением
const showCard = (cardCaption, cardImage) => {
  copyText(popupCardCaption, cardCaption);
  copyImage(popupCardImage, cardImage);
  showModal(popupCard, handleHide);
};

//размещение карточки в контейнере
const putCard = (card) => {
  placesList.prepend(
    createCard(card, {
      cardTemplate,
      removeCard,
      likeCard,
      showCard,
      currentUser: profileInfo,
    })
  );
};

//вывод карточек из массива
const initializeCards = (cardsList) => {
  cardsList.forEach((card) => {
    putCard(card);
  });
};

//функция для слушателя закрытия модального окна
const handleHide = (evt) => {
  if (
    (evt.type === 'click' &&
      (evt.target.classList.contains(modalClasses.general) ||
        evt.target.classList.contains(modalClasses.closeButton))) ||
    evt.key === 'Escape'
  ) {
    const modalRule = getActiveModal(modalRules);
    if (modalRule.form) {
      modalRule.setup(); //сброс значений формы до тредуемых при закрытии модального окна
    }
    if (modalRule) {
      hideModal(modalRule.popup, handleHide);
    }
  }
};

//слушатели действий с модальным окном
const handleModal = (evt) => {
  const modal = getModal(modalRules, evt.target); // поиск окна по классу кнопки
  if (modal && !getActiveModal(modalRules)) {
    //если найдено окно и нет ещё активного
    showModal(modal.popup, handleHide);
  }
};

//собранные в один массив объекты, содержащие соответствующие друг-другу модальные окна, классы активаторов, формы и их обработчики
const modalRules = [
  {
    activator: 'profile__edit-button',
    popup: popupEdit,
    form: formEdit,
    setup: setupProfile, //первоначальная установка и сброс форм
    submit: submitProfile, //отправка форм
    request: requestUpdateProfile,
    parameters: () => ({
      name: formEdit.elements.name.value,
      about: formEdit.elements.description.value,
    }),
  },
  {
    activator: 'profile__add-button',
    popup: popupNewPlace,
    form: formNewPlace,
    setup: () => formNewPlace.reset(),
    submit: submitPlace,
    request: requestPutCard,
    parameters: () => ({
      name: formNewPlace.elements['place-name'].value,
      link: formNewPlace.elements['link'].value,
    }),
  },
  {
    activator: 'profile__image',
    popup: popupAvatar,
    form: formAvatar,
    setup: () => formAvatar.reset(),
    submit: submitAvatar,
    request: requestUpdateAvatar,
    parameters: () => ({ avatar: formAvatar.elements.link.value }),
  },
  {
    activator: 'card__delete-button',
    popup: popupDeleteCard,
    form: formDeleteCard,
    setup: () => {
      markedCard = null;
    },
    submit: submitDeleteCard,
    request: requestRemoveCard,
    parameters: () => markedCard.card,
    loading: modalClasses.removingMessage,
    multiple: true,
  },
  {
    activator: 'card__image',
    popup: popupCard,
    multiple: true,
  },
];

const initializePage = () => {
  Promise.all([getInitialCards(), getProfileInfo()])
    .then(([initialCards, userInfo]) => {
      profileInfo = userInfo;
      setupProfileInfo(profileInfo);
      initializeCards(initialCards);
      //обработчики оверлеев
      enableValidation(formSettings);
      modalRules.forEach((modal) => {
        if (!modal.multiple) {
          modal.activatorElement = document.querySelector(
            '.' + modal.activator
          );
          modal.activatorElement.addEventListener('click', handleModal);
        }
        //навесить слушатель сабмита на формы
        if (modal.form) {
          const submitForm = (evt) => {
            const makeRequest = () => {
              //создаёт запрос на сабмит на основе промиса ответа от сервера
              return modal
                .request(modal.parameters ? modal.parameters() : undefined) //для каждой формы выбирается своя функция запроса к серверу и параметры
                .then(modal.submit);
            };
            handleSubmit(
              //для каждой формы свой обработчик запроса
              evt,
              makeRequest,
              {
                popup: modal.popup,
                makeRequest,
                hideModal,
                handleHide,
                loadingText: modal.loading ? modal.loading : undefined,
              } //если есть кастомное сообщение загрузки, то вывести его
            );
          };
          modal.setup();
          modal.form.addEventListener('submit', submitForm);
        }
      });
    })
    .catch(console.error);
};

initializePage();
