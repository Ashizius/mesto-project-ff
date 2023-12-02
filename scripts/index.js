let cardAmount = initialCards.length + 1;
const maxCards = 6; // максимальное число выводимых карточек
const сardRandomizer = true; // включение перемешивания карточек
let createdCards = []; // массив выведенных на страницу карточек

// Темплейт карточки
const cardTemplate = document.querySelector('#card-template').content;

// DOM узлы
const placesList = document.querySelector('.places__list');

// Функция размещения карточки
const putCard = function (card, removeCard) {
  const cardElement = cardTemplate.querySelector('.card').cloneNode(true);
  const cardImage = cardElement.querySelector('.card__image');
  const cardTitle = cardElement.querySelector('.card__title');
  const cardDeleteButton = cardElement.querySelector('.card__delete-button');
  cardImage.src = card.link;
  cardImage.alt = 'фотография с изображением места' + card.name;
  cardTitle.textContent = card.name;
  cardDeleteButton.addEventListener('click', removeCard);
  return cardElement;
};

//получить уникальную случайную карточку:
const getRandomCard = function () {
  let randomCard = initialCards[Math.floor(Math.random() * (cardAmount - 1))]; //случайная карточка
  //проверка на уникальность ↓
  if (
    createdCards.some(function (card) {
      return randomCard.name === card.name && randomCard.link === card.link;
    })
  ) {
    randomCard = getRandomCard(); //если уже есть в массиве, то взять другую случайную карточку
  }
  //конец проверки на уникальность ↑
  return randomCard;
};

// Функция создания карточки
const createCard = function (index) {
  const card = сardRandomizer ? getRandomCard() : initialCards[index];
  return card;
};

// Функция удаления карточки
const removeCard = function (event) {
  createdCards = createdCards.filter(function (card) {
    return !(
      card.name ===
        event.target.parentElement.querySelector('.card__title').textContent &&
      card.link === event.target.parentElement.querySelector('.card__image').src
    );
  });
  event.target.parentElement.remove();
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
createdCards.forEach((card) => placesList.append(putCard(card, removeCard)));
