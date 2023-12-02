let cardAmount = initialCards.length + 1;
const maxCards = 6; // максимальное число выводимых карточек
const сardRandomizer = true; // включение перемешивания карточек
let createdCards = []; // массив индексов выведенных карточек

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

//получить номер случайной карточки:
const getRandomCardIndex = function () {
  let rndCardIndex = Math.floor(Math.random() * (cardAmount - 1)); //случайный номер карточки
  //проверка на уникальность ↓
  if (
    createdCards.some(
      function (cardIndex) {
        return rndCardIndex === cardIndex;
      }
    )
  ) {
    rndCardIndex = getRandomCardIndex(); //если уже есть в массиве, то взять другое случайное число
  } 
  //конец проверки на уникальность ↑
  return rndCardIndex;
}

// Функция удаления карточки
const removeCard = function (event) {
  createdCards=createdCards.filter(function (item) {
      return initialCards[item].name!==event.target.parentElement.querySelector('.card__title').textContent
    });
  event.target.parentElement.remove();
};

// Вывести карточки на страницу^
for (let i = 0; i < (cardAmount < maxCards ? cardAmount : maxCards); i++) {
  const index=сardRandomizer? getRandomCardIndex():i;
  card=initialCards[index];
  createdCards.push(index);
  placesList.append(putCard(card));
}
/*код ниже тоже рабочий, но длиннее,
т.к. есть ограничение на количество выведенных карточек в 6 шт.*/
/*initialCards.forEach(function (initialCard, index){
  if (index < (cardAmount < maxCards ? cardAmount : maxCards)) {
    let card;
    if (сardRandomizer) {
      const indexRandom=getRandomCardIndex();
      card=initialCards[indexRandom];
      createdCards.push(indexRandom);
    }
    else {
      card=initialCard;
      createdCards.push(index);
    }
    placesList.append(putCard(card));
  }
});
*/