let cardAmount = initialCards.length + 1;
const maxCards = 6; // максимальное число выводимых карточек
const сardRandomizer = true; // включение перемешивания карточек
let createdCards = []; // массив номеров выведенных карточек

// Темплейт карточки
const cardTemplate = document.querySelector('#card-template').content;

// DOM узлы
const placesList = document.querySelector('.places__list');

// Функция создания карточки
const putCard = function (initialCard) {
  const cardElement = cardTemplate.querySelector('.card').cloneNode(true);
  const cardImage = cardElement.querySelector('.card__image');
  const cardTitle = cardElement.querySelector('.card__title');
  const cardDeleteButton = cardElement.querySelector('.card__delete-button');
  cardImage.src = initialCard.link;
  cardImage.alt = 'фотография с изображением места' + initialCard.name;
  cardTitle.textContent = initialCard.name;
  cardDeleteButton.addEventListener('click',removeCard);
  return cardElement;
};

//получить номер случайной карточки
const getRandomCard = function () {
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
    createdCards.push(rndCardNumber);
    console.log(createdCards); //записать в массив уникальных карточек
  }
  //конец проверки на уникальность ↑
  return rndCardNumber;
}

// Функция удаления карточки
const removeCard = function (event) {
  createdCards=createdCards.filter(function (item) {
      /*удалить!!!*/if (initialCards[item].name===event.target.parentElement.querySelector('.card__title').textContent) {console.log(item);console.log(event.target.parentElement.querySelector('.card__title').textContent);}
      return initialCards[item].name!==event.target.parentElement.querySelector('.card__title').textContent
    });
  console.log(createdCards);
  event.target.parentElement.remove();
};
// Вывести карточки на страницу
initialCards.forEach(function (initialCard, index){
  const card=сardRandomizer ? initialCards[getRandomCard()] : initialCard;
  if (index < (cardAmount < maxCards ? cardAmount : maxCards)) {
    placesList.append(putCard(card));
  }
});

/*for (let i = 0; i < (cardAmount < maxCards ? cardAmount : maxCards); i++) {
  initialCard=сardRandomizer ? initialCards[getRandomCard()] : initialCards[i];
  placesList.append(putCard(initialCard));
  console.log(placesList);
}*/