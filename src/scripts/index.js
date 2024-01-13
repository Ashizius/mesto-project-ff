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

import initialCards from './cards.js'; //импорт списка карточек
import { createCard, likeCard } from './card.js'; //импорт функций поведения карточек
import { showModal, hideModal } from './modal.js'; //импорт функции открытия и закрытия модального окна, а также оперирование формами
import { modalClasses, formSettings } from './constants.js'; //импорт классов модальных окон
import { clearValidation, enableValidation, setFormValid } from './validation.js'; //импорт классов модальных окон
/*import { getInitialCards } from './api.js';
const initialCards=getInitialCards()
  .then((result) => {
    return result;
  })
  .catch((err) => {
    console.log(err); // выводим ошибку в консоль
  }); 
*/
//функции сброса и отправки формы редактирования профиля
const setupProfile = function () {
  formEdit.elements.name.value = profileName.textContent;
  formEdit.elements.description.value = profileDescription.textContent;
  setFormValid(formEdit, formSettings);
};
const submitProfile = function (evt) {
  evt.preventDefault();
  profileName.textContent = formEdit.elements.name.value;
  profileDescription.textContent = formEdit.elements.description.value;
  hideModal(popupEdit, handleHide);
};
//функции сброса и отправки формы редактирования аватара
const setupAvatar = function () {
  formAvatar.reset();
  clearValidation(formAvatar, formSettings);
};
const submitAvatar = function (evt) {
  evt.preventDefault();
  profileAvatar.style.backgroundImage = `url("${formAvatar.elements.link.value}")`;
  hideModal(popupAvatar, handleHide);
};
//функции сброса и отправки формы создания карточки
const setupPlace = function () {
  formNewPlace.reset();
  clearValidation(formNewPlace, formSettings);
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
  hideModal(popupNewPlace, handleHide);
  clearValidation(formNewPlace, formSettings);
  formNewPlace.reset();
};

let markedCard;

// Функция удаления карточки
/*const removeCard = new Promise(function (resolve, reject) {

    if (rand) {
        resolve();
    } else {
        reject('закрытие окна');
    }
});*/


/*const removeCard = function (cardElement) {
  if (true) {
    cardElement.remove();
    return 0
  }
  else {
    return 1
  }
};
*/
//функции отправки формы удаления карточки
/*const removeCard = function (card,remove,handle) {
  const handleRemove=(evt) =>{
    evt.preventDefault();
    remove(card,handle);
    hideModal(popupDeleteCard, handleHide);
    formDeleteCard.removeEventListener('submit',handleRemove);    
  }
  formDeleteCard.addEventListener('submit',handleRemove);
}
*/
const removeCard = function (card,remove,handle) {
  markedCard={};
  markedCard.card=card;
  markedCard.remove=remove;
  markedCard.handle=handle;
}

const submitDeleteCard = (evt) => {
  evt.preventDefault();
  if (markedCard) {
    markedCard.remove(markedCard.card,markedCard.handle);
    hideModal(popupDeleteCard, handleHide);
    markedCard=null;
  }
}

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
    setup: ()=>{markedCard=null;},
    submit: submitDeleteCard,
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

//функция, которая ищет среди модальных окон открытое
const getActiveModal = function () {
  return modalRules.find((item) =>
    item.popup.classList.contains(modalClasses.activated)
  );
};

//функция для слушателя закрытия модального окна
const handleHide = function (evt) {
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
const handleModal = function (evt) {
  const modalRule = getModal(evt.target); // поиск окна по классу кнопки
  if (modalRule && !getActiveModal()) {
    //если найдено окно и нет ещё активного
    showModal(modalRule.popup, handleHide);
  }
};

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