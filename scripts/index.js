let cardAmount = initialCards.length + 1;
const maxCards = 6; // максимальное число выводимых карточек
const сardRandomizer = true; // включение перемешивания карточек
let createdCards = []; // массив номеров выведенных карточек

// @todo: Темплейт карточки
const cardTemplate = document.querySelector('#card-template').content;

// @todo: DOM узлы
const placesList = document.querySelector('.places__list');

// @todo: Функция создания карточки
const putCard = function (initialCard) {
  const cardElement = cardTemplate.querySelector('.card').cloneNode(true);
  const cardImage = cardElement.querySelector('.card__image');
  const cardTitle = cardElement.querySelector('.card__title');
  cardImage.src = initialCard.link;
  cardImage.alt = initialCard.name;
  cardTitle.textContent = initialCard.name;
  placesList.append(cardElement);
  return 0;
};

function getRandomCard() {
  //получить номер случайной карточки
  let rndCardNumber = Math.floor(Math.random() * (cardAmount - 1)); //случайный номер карточки
  //проверка на уникальность↓
  if (
    createdCards.some(
      function (cardNumber) {
        return rndCardNumber === cardNumber;
      }
    )
  ) {
    rndCardNumber = getRandomCard(); //если уже есть в массиве, то взять другое случайное число
  } else {
    createdCards.push(rndCardNumber); //записать в массив уникальных карточек
  }
  //конец проверки на уникальность ↑
  return rndCardNumber;
}

// @todo: Функция удаления карточки
const removeCard = function () {};
// @todo: Вывести карточки на страницу

for (let i = 0; i < (cardAmount < maxCards ? cardAmount : maxCards); i++) {
  putCard(сardRandomizer ? initialCards[getRandomCard()] : initialCards[i]);
}
