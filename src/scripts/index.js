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
/*const formEditButton = findSubmitButton(formEdit);
const formNewPlaceButton = findSubmitButton(formNewPlace);
const formAvatarButton = findSubmitButton(formAvatar);
const formDeleteCardButton = findSubmitButton(formDeleteCard);*/

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
  clearValidation(formEdit, formSettings);
};
const submitProfile = (evt) => {
  evt.preventDefault();
  const submitButton = evt.submitter;
  const initialText = submitButton.textContent;
  toggleLoadingVisualisation(true,
    submitButton,
    {loadingText:modalClasses.savingMessage}
  ); //смена надписи кнопки
  requestUpdateProfile({
    name: formEdit.elements.name.value,
    about: formEdit.elements.description.value,
  })
    .then((profile) => {
      profileName.textContent = profile.name; //запись значения из ответа сервера
      profileDescription.textContent = profile.about; //запись значения из ответа сервера
      hideModal(popupEdit, handleHide);
      toggleLoadingVisualisation(false,
        submitButton,
        {commonText:initialText}
      ); //возврат надписи кнопки
      clearValidation(formEdit, formSettings);
    })
    .catch((error) => {
      toggleLoadingVisualisation(false,
        submitButton,
        {isError: true,
        errorText: error}
      ); //смена надписи на предложение повторить
    });
};

//функции сброса и отправки формы редактирования аватара
const setupAvatar = () => {
  formAvatar.reset();
};
const submitAvatar = (evt) => {
  evt.preventDefault();
  const submitButton = evt.submitter;
  const initialText = submitButton.textContent;
  toggleLoadingVisualisation( true,
    submitButton,
    {loadingText:modalClasses.savingMessage}
  );
  requestUpdateAvatar({ avatar: formAvatar.elements.link.value })
    .then((profile) => {
      profileAvatar.style.backgroundImage = `url("${profile.avatar}")`; //запись значения из ответа сервера
      hideModal(popupAvatar, handleHide);
      formAvatar.reset();
      toggleLoadingVisualisation(false,
        submitButton,
        {commonText:initialText}
      );
      formAvatar.reset();  //UPDATE: ошибки скрываются сразу по событию сброса формы
    })
    .catch((error) => {
      toggleLoadingVisualisation(false,
        submitButton,
        {isError: true,
          errorText: error}
      );
    });
};

//функции сброса и отправки формы создания карточки
const setupPlace = () => {
  formNewPlace.reset();
};
const submitPlace = function (evt) {
  evt.preventDefault();
  const submitButton = evt.submitter;
  const initialText = submitButton.textContent;
  toggleLoadingVisualisation(true,
    submitButton,
    {loadingText:modalClasses.savingMessage}
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
      formNewPlace.reset();
      toggleLoadingVisualisation(false,
        submitButton,
        {commonText:initialText}
      );
      formNewPlace.reset(); //UPDATE: ошибки скрываются сразу по событию сброса формы
    })
    .catch((error) => {
      toggleLoadingVisualisation(false,
        submitButton,
        {isError: true,
          errorText: error}
      );
    });
};

//функция лайка карточки
const likeCard = (cardLikeButton, cardLikeCounter, card, userId) => {
  if (!userId) {
    cardLikeCounter.textContent = card.likes.length;
    return;
  } //Если не указан пользователь, то просто вывести количество лайков
  cardLikeCounter.textContent='⌛️'; //выводит символ в количество лайков, на время получения ответа от сервера
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
  showModal(popupDeleteCard,handleHide);
  markedCard = {};
  markedCard.cardElement = cardElement;
  markedCard.remove = remove;
  markedCard.handle = handle;
  markedCard.card = card;
};

const submitDeleteCard = (evt) => {
  evt.preventDefault();
  const submitButton = evt.submitter;
  const initialText = submitButton.textContent;
  toggleLoadingVisualisation(true,
    submitButton,
    {loadingText:modalClasses.removingMessage}
  );
  if (markedCard) {
    //если есть помеченная карточка под удаление, то сносим
    requestRemoveCard(markedCard.card)
      .then(() => {
        markedCard.remove(markedCard.cardElement, markedCard.handle);
        hideModal(popupDeleteCard, handleHide);
        markedCard = null; //сбрасываем помеченную карточку
        toggleLoadingVisualisation(false,
          submitButton,
          {commonText:initialText}
        );
      })
      .catch((error) => {
        toggleLoadingVisualisation(false,
          submitButton,
          {isError: true,
            errorText: error}
        );
      });
  }
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
  showModal(popupCard,handleHide);
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
  const modal = getModal(modalRules,evt.target); // поиск окна по классу кнопки
  if (modal && !getActiveModal(modalRules)) {
    //если найдено окно и нет ещё активного
    showModal(modal.popup, handleHide);
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
    multiple: true
  },
  {
    activator: 'card__image',
    popup: popupCard,
    multiple: true
  },
];


const initializePage = () => {
  Promise.all([getInitialCards(), getProfileInfo()])
    .then(([initialCards, userInfo]) => {
      profileInfo = userInfo;
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
       //сразу на весь документ, чтобы уменьшить количество слушателей событий
      enableValidation(formSettings);
      modalRules.forEach((modal) => {
        if (!modal.multiple) {
          modal.activatorElement=document.querySelector('.'+modal.activator);
          modal.activatorElement.addEventListener('click', handleModal);
        }
/*        else {
          modal.activatorElements=Array.from(document.querySelectorAll('.'+modal.activator));
          modal.activatorElements.forEach(activatorElement=>activatorElement.addEventListener('click', handleModal));
        }*/
        if (modal.form) {//навесить слушатель сабмита на формы
          modal.setup();
          modal.form.addEventListener('submit', modal.submit);
        }
      });
    })
    .catch(console.error);
};

initializePage();