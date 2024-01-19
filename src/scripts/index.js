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
const findSubmitButton = (form) => form.querySelector(formSettings.submitButtonSelector);
const formEditButton = findSubmitButton(formEdit);
const formNewPlaceButton = findSubmitButton(formNewPlace);
const formAvatarButton = findSubmitButton(formAvatar);
const formDeleteCardButton = findSubmitButton(formDeleteCard);

import { createCard } from './card.js'; //импорт функций поведения карточек
import { showModal, hideModal } from './modal.js'; //импорт функции открытия и закрытия модального окна, а также оперирование формами
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
  toggleLoadingVisualisation
} from './api.js';

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
  clearValidation(formEdit, formSettings); //по заданию сказано использовать такую функцию, которая выключает кнопку отправки формы
};
const submitProfile = (evt) => {
  evt.preventDefault();
  const initialText = toggleLoadingVisualisation(
    formEditButton,
    modalClasses.savingMessage,
    formSettings.inactiveButtonClass
  ); //смена надписи кнопки
  requestUpdateProfile({
    name: formEdit.elements.name.value,
    about: formEdit.elements.description.value,
  })
    .then((profile) => {
      profileName.textContent = profile.name; //запись значения из ответа сервера
      profileDescription.textContent = profile.about; //запись значения из ответа сервера
      hideModal(popupEdit, handleHide);
      toggleLoadingVisualisation(
        formEditButton,
        initialText,
        formSettings.inactiveButtonClass
      ); //возврат надписи кнопки
      clearValidation(formEdit, formSettings);
    })
    .catch((error) => {
      toggleLoadingVisualisation(
        formEditButton,
        error,
        formSettings.inactiveButtonClass,
        true
      ); //смена надписи на предложение повторить
    });
};

//функции сброса и отправки формы редактирования аватара
const setupAvatar = () => {
  formAvatar.reset();
  clearValidation(formAvatar, formSettings);
};
const submitAvatar = (evt) => {
  evt.preventDefault();
  const initialText = toggleLoadingVisualisation(
    formAvatarButton,
    modalClasses.savingMessage,
    formSettings.inactiveButtonClass
  );
  requestUpdateAvatar({ avatar: formAvatar.elements.link.value })
    .then((profile) => {
      profileAvatar.style.backgroundImage = `url("${profile.avatar}")`; //запись значения из ответа сервера
      hideModal(popupAvatar, handleHide);
      formAvatar.reset();
      toggleLoadingVisualisation(
        formAvatarButton,
        initialText,
        formSettings.inactiveButtonClass
      );
      clearValidation(formAvatar, formSettings);
    })
    .catch((error) => {
      toggleLoadingVisualisation(
        formAvatarButton,
        error,
        formSettings.inactiveButtonClass,
        true
      );
    });
};
//функции сброса и отправки формы создания карточки
const setupPlace = () => {
  formNewPlace.reset();
  clearValidation(formNewPlace, formSettings);
};
const submitPlace = function (evt) {
  evt.preventDefault();
  const initialText = toggleLoadingVisualisation(
    formNewPlaceButton,
    modalClasses.savingMessage,
    formSettings.inactiveButtonClass
  );
  requestPutCard({
    name: formNewPlace.elements['place-name'].value,
    link: formNewPlace.elements['link'].value,
  })
    .then((card) => {
      putCard(
        card,
        cardTemplate,
        placesList,
        createCard,
        removeCard,
        likeCard,
        showCard,
        profileInfo
      );
      hideModal(popupNewPlace, handleHide);
      clearValidation(formNewPlace, formSettings);
      formNewPlace.reset();
      toggleLoadingVisualisation(
        formNewPlaceButton,
        initialText,
        formSettings.inactiveButtonClass
      );
    })
    .catch((error) => {
      toggleLoadingVisualisation(
        formNewPlaceButton,
        error,
        formSettings.inactiveButtonClass,
        true
      );
    });
};

//функция лайка карточки
const likeCard = (cardLikeButton, cardLikeCounter, card, userId) => {
  if (!userId) {
    cardLikeCounter.textContent = card.likes.length;
    return;
  } //Если не указан пользователь, то просто вывести количество лайков
  toggleLoadingVisualisation(cardLikeCounter, '⌛️', null); //выводит символ в количество лайков, на время получения ответа от сервера
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
        console.log(err); //выводит сообщение об ошибке в консоль
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
        console.log(err);
        cardLikeCounter.textContent = '?';
      });
  }
};

const removeCard = (cardElement, remove, handle, card) => {
  //данная функция вызывается при клике по корзине и помечает карточку под удаление, заодно так гарантируется, что удаляемая карточка единственная
  markedCard = {};
  markedCard.cardElement = cardElement;
  markedCard.remove = remove;
  markedCard.handle = handle;
  markedCard.card = card;
};

const submitDeleteCard = (evt) => {
  evt.preventDefault();
  const initialText = toggleLoadingVisualisation(
    formDeleteCardButton,
    modalClasses.removingMessage,
    formSettings.inactiveButtonClass
  );
  if (markedCard) {
    //если есть помеченная карточка под удаление, то сносим
    requestRemoveCard(markedCard.card)
      .then(() => {
        markedCard.remove(markedCard.cardElement, markedCard.handle);
        hideModal(popupDeleteCard, handleHide);
        markedCard = null; //сбрасываем помеченную карточку
        toggleLoadingVisualisation(
          formDeleteCardButton,
          initialText,
          formSettings.inactiveButtonClass
        );
      })
      .catch((error) => {
        toggleLoadingVisualisation(
          formDeleteCardButton,
          error,
          formSettings.inactiveButtonClass,
          true
        );
      });
  }
};

//собранные модальные окна в один объект
const modalRules = [
  {
    activator: 'profile__edit-button',
    popup: popupEdit,
    form: formEdit,
    setup: setupProfile, //первоначальная установка и сброс форм
    submit: submitProfile, //отправка форм
  },
  {
    activator: 'profile__add-button',
    popup: popupNewPlace,
    form: formNewPlace,
    setup: setupPlace,
    submit: submitPlace,
  },
  {
    activator: 'profile__image',
    popup: popupAvatar,
    form: formAvatar,
    setup: setupAvatar,
    submit: submitAvatar,
  },
  {
    activator: 'card__delete-button',
    popup: popupDeleteCard,
    form: formDeleteCard,
    setup: () => {
      markedCard = null;
    },
    submit: submitDeleteCard,
  },
  {
    activator: 'card__image',
    popup: popupCard,
  },
];

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
};

//размещение карточки в контейнере
const putCard = (
  card,
  template,
  container,
  create,
  remove,
  like,
  show,
  owner
) => {
  container.prepend(create(card, template, remove, like, show, owner));
};

//вывод карточек из массива
const initializeCards = (
  cardsList,
  template,
  container,
  create,
  remove,
  like,
  show,
  owner
) => {
  cardsList.forEach((card) => {
    putCard(card, template, container, create, remove, like, show, owner);
  });
};

//функция, которая получает модальное окно с правилами взаимодействия по классу вызывающего его элемента
const getModal = (element) => {
  return modalRules.find(
    (item) =>
      element.classList.contains(item.activator) || element === item.popup
  );
};

//функция, которая ищет среди модальных окон открытое
const getActiveModal = () => {
  return modalRules.find((item) =>
    item.popup.classList.contains(modalClasses.activated)
  );
};

//функция для слушателя закрытия модального окна
const handleHide = (evt) => {
  if (
    (evt.type === 'click' &&
      (evt.target.classList.contains(modalClasses.general) ||
        evt.target.classList.contains(modalClasses.closeButton))) ||
    evt.key === 'Escape'
  ) {
    const modalRule = getActiveModal();
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
  const modalRule = getModal(evt.target); // поиск окна по классу кнопки
  if (modalRule && !getActiveModal()) {
    //если найдено окно и нет ещё активного
    showModal(modalRule.popup, handleHide);
  }
};

const initializePage = () => {
  Promise.all([getInitialCards(), getProfileInfo()])
    .then((results) => {
      const initialCards = results[0];
      profileInfo = results[1];
      setupProfileInfo(profileInfo);
      initializeCards(
        initialCards,
        cardTemplate,
        placesList,
        createCard,
        removeCard,
        likeCard,
        showCard,
        profileInfo
      );
      //обработчики оверлеев
      document.addEventListener('click', handleModal); //сразу на весь документ, чтобы уменьшить количество слушателей событий
      //навесить слушатель сабмита на все формы
      modalRules.forEach((item) => {
        if (item.form) {
          item.setup();
          item.form.addEventListener('submit', item.submit);
        }
      });
      enableValidation(formSettings);
    })
    .catch((error) => {
      console.log(error); // выводим ошибку в консоль
    });
};

initializePage();