import { token, cohortID } from './token.js';

const config = {
  baseUrl: `https://nomoreparties.co/v1/${cohortID}`,
  headers: {
    authorization: token,
    'Content-Type': 'application/json',
  },
};

const handleResponse = (res) => {
  if (res.ok) {
    return res.json();
  }
  // если ошибка, отклоняем промис
  return Promise.reject(`Ошибка: ${res.status}`);
};

const sendRequest = (link, settings) => {
  return fetch(`${config.baseUrl}${link}`, settings).then(handleResponse);
};

export const getInitialCards = () => {
  return sendRequest('/cards', {
    headers: config.headers,
  });
};

export const getProfileInfo = () => {
  return sendRequest('/users/me', {
    headers: config.headers,
  });
};

export const requestUpdateProfile = (message) => {
  return sendRequest('/users/me', {
    method: 'PATCH',
    headers: config.headers,
    body: JSON.stringify(message),
  });
};

export const requestUpdateAvatar = (avatar) => {
  return sendRequest('/users/me/avatar', {
    method: 'PATCH',
    headers: config.headers,
    body: JSON.stringify(avatar),
  });
};

export const requestPutCard = (card) => {
  return sendRequest('/cards', {
    method: 'POST',
    headers: config.headers,
    body: JSON.stringify(card),
  });
};

export const requestRemoveCard = (card) => {
  return sendRequest(`/cards/${card._id}`, {
    method: 'DELETE',
    headers: config.headers,
  });
};

export const requestLikeCard = (cardId) => {
  return sendRequest(`/cards/likes/${cardId}`, {
    method: 'PUT',
    headers: config.headers,
  });
};

export const requestUnlikeCard = (cardId) => {
  return sendRequest(`/cards/likes/${cardId}`, {
    method: 'DELETE',
    headers: config.headers,
  });
};

