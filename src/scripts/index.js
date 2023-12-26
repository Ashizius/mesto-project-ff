import initialCards from './cards.js';
import '../pages/index.css';
let maxCards = 6; // максимальное число выводимых карточек
const сardRandomizer = true; // включение перемешивания карточек
let cardAmount = initialCards.length + 1;
let createdCards = []; // массив выведенных на страницу карточек
const buttonActions ={
  'profile__edit-button' : '.popup_type_edit',
  'profile__add-button' : '.popup_type_new-card',
  'card__image' : '.popup_type_image'
} //соответствие классов актуаторов и классов попапов

// Темплейт карточки
const cardTemplate = document.querySelector('#card-template').content;

// DOM узлы
const placesList = document.querySelector('.places__list');
const placesListClone = placesList.cloneNode(false); //чтобы сразу все карточки добавить одним скопом в DOM
const editButton = document.querySelector('.profile__edit-button');

// Функция размещения карточки
const putCard = function (card, removeCard) {
  const cardElement = cardTemplate.querySelector('.card').cloneNode(true);
  const cardImage = cardElement.querySelector('.card__image');
  const cardTitle = cardElement.querySelector('.card__title');
  const cardDeleteButton = cardElement.querySelector('.card__delete-button');
  cardImage.src = card.link;
  cardImage.alt = 'фотография с изображением места ' + card.name;
  cardTitle.textContent = card.name;
  cardDeleteButton.addEventListener('click', removeCard);
  return cardElement;
};

//получить уникальную случайную карточку:
const getRandomCard = function () {
  let randomCard = initialCards[Math.floor(Math.random() * (cardAmount - 1))]; //случайная карточка
  //проверка на уникальность ↓
  if (
    createdCards.some(
      (card) => randomCard.name === card.name && randomCard.link === card.link
    )
  ) {
    randomCard = getRandomCard(); //если уже есть в массиве, то взять другую случайную карточку
  }
  //конец проверки на уникальность ↑
  return randomCard;
};

// Функция создания карточки
const createCard = (index) =>
  сardRandomizer ? getRandomCard() : initialCards[index];

// Функция удаления карточки
const removeCard = function (event) {
  createdCards = createdCards.filter((card) => {
    const targetName =
      event.target.closest('.card').querySelector('.card__title').textContent;
    const targetLink =
      event.target.closest('.card').querySelector('.card__image').src;
    return !(card.name === targetName && card.link === targetLink);
  });
  event.target.closest('.card').remove();
};

//инициализация карточек при запуске страницы
const initializeCards = function () {
  for (let i = 0; i < (cardAmount < maxCards ? cardAmount : maxCards); i++) {
    createdCards.push(createCard(i)); //внести карточку в массив созданных
  }
  /*for нужен для того, что
    может быть необходимо ограничить сверху количество карточек*/
};
initializeCards();

//Вывести карточки на страницу
createdCards.forEach((card) =>
  placesListClone.append(putCard(card, removeCard))
);
placesList.replaceWith(placesListClone);

//overlays
const popup={
  showHandler: function (evt) {
    if (evt.target.classList.contains('profile__edit-button')) {
      popup.current=document.querySelector(buttonActions['profile__edit-button']);
      const name=document.querySelector('.profile .profile__title').textContent;
      const description=document.querySelector('.profile .profile__description').textContent;
      document.forms['edit-profile'].elements.name.value=name;
      document.forms['edit-profile'].elements.description.value=description;
      popup.type='form';
    }
    if (evt.target.classList.contains('profile__add-button')) {
      popup.current=document.querySelector(buttonActions['profile__add-button']);
      popup.type='form';
    }
    if (evt.target.classList.contains('card__image')) {
      popup.current=document.querySelector(buttonActions['card__image']);
      const image=popup.current.querySelector('.popup__image');
      image.src=evt.target.src;
      image.alt=evt.target.alt;
      popup.type='image';
    }
    if (popup.type) {popup.show('');}
  },
  show: function () {
    popup.current.style.display = 'flex';
    popup.current.addEventListener('click',popup.closeHandler);
    document.addEventListener('keydown',popup.closeHandler);
    popup.current.querySelector('.popup__button').addEventListener('click',popup.submitHandler);
    popup.current.querySelector('.popup__button').addEventListener('keydown',popup.submitHandler);
  },
  submitHandler: function (evt) {

  },
  save: function () {

  },  
  closeHandler: function (evt) {
    console.log(evt.target.classList);
    if ((evt.type === 'click') && (evt.target.classList.contains('popup') || evt.target.classList.contains('popup__close'))) {
      popup.close();
    }
    else if (evt.key === 'Escape') {
      popup.close();
    }
  },
  close: function () {
    popup.current.removeEventListener('click',popup.closeHandler);
    document.removeEventListener('keydown',popup.closeHandler);
    popup.current.style.display='none';
    delete popup.current;
    delete popup.type;
  },
  current: undefined, //выведено для обозначения наличия переменной в библиотеке
  type: undefined
}


//обработчики оверлеев
document.addEventListener('click',popup.showHandler);
//popup.show('.popup_type_new-card');
//console.log(popup.current);