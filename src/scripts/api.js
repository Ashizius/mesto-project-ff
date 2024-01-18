import { token, cohortID } from "./token.js";

const config = {
    baseUrl: `https://nomoreparties.co/v1/${cohortID}`,
    headers: {
      authorization: token,
      'Content-Type': 'application/json'
    }
  }

const handleResponse=(res) => {
    if (res.ok) {
      return res.json();
    }
    // если ошибка, отклоняем промис
    return Promise.reject(`Ошибка: ${res.status}`);
}

const receiveFromServer = (link) => {
  return fetch(`${config.baseUrl}${link}`, {
    headers: config.headers
  })
    .then(handleResponse);
}

const updateOnServer = (link, message) => {
  return fetch(`${config.baseUrl}${link}`, {
    method: 'PATCH',
    headers: config.headers,
    body: JSON.stringify(message)
  })
  .then(handleResponse);
}

const uploadToServer = (link, message) => {
  return fetch(`${config.baseUrl}${link}`, {
    method: 'POST',
    headers: config.headers,
    body: JSON.stringify(message)
  })
  .then(handleResponse);
}

const deleteFromServer = (link) => {
  return fetch(`${config.baseUrl}${link}`, {
    method: 'DELETE',
    headers: config.headers
  })
  .then(handleResponse);
}

const addToServer = (link) => {
  return fetch(`${config.baseUrl}${link}`, {
    method: 'PUT',
    headers: config.headers
  })
  .then(handleResponse);
}

export const getInitialCards = () => {
  return receiveFromServer('/cards')
} 

export const getProfileInfo = () => {
  return receiveFromServer('/users/me')
}

export const requestUpdateProfile = (profile) => {
  return updateOnServer('/users/me',profile)
}

export const requestUpdateAvatar = (avatar) => {
  return updateOnServer('/users/me/avatar',avatar)
}

export const requestPutCard = (card) => {
  return uploadToServer('/cards',card)
}

export const requestRemoveCard = (card) => {
  return deleteFromServer(`/cards/${card._id}`)
}

export const requestLikeCard = (cardId) => {
  return addToServer(`/cards/likes/${cardId}`)
}

export const requestUnlikeCard = (cardId) => {
  return deleteFromServer(`/cards/likes/${cardId}`)
}

export const toggleLoadingVisualisation = (element,text,toggledClass,isError) => {
  const initialValue=element.textContent;
  if (isError) {
    const maxlength=30;
    if (typeof text !== 'string') {
      text = 'ошибка';
    }
    text='Повторить ('+text+')';
    if (text.length> maxlength) {
      text = text.substring(0,maxlength-5)+'...)';
    }
  
  }
  element.textContent=text;
    if (toggledClass) {
      element.classList.toggle(toggledClass);
    }
  return initialValue;
}