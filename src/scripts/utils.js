const renderLoading = (
  isLoading,
  element,
  {
    commonText = 'Сохранить',
    loadingText = 'Сохранение...',
    isError = false,
    errorText = 'ошибка',
  }
) => {
  const initialValue = element.textContent;
  if (isError) {
    const maxlength = 30;
    if (typeof errorText !== 'string') {
      errorText = 'ошибка';
    }
    errorText = 'Повторить (' + errorText + ')';
    if (errorText.length > maxlength) {
      errorText = errorText.substring(0, maxlength - 5) + '...)';
    }
    element.textContent = errorText;
  } else {
    element.textContent = isLoading ? loadingText : commonText;
  }
  isLoading
    ? element.setAttribute('disabled', '')
    : element.removeAttribute('disabled');
  return initialValue;
};

export const handleSubmit = (
  evt,
  request,
  { popup, handleHide, hideModal, loadingText = 'Сохранение...' }
) => {
  evt.preventDefault();
  const submitButton = evt.submitter;
  const initialText = submitButton.textContent;
  renderLoading(true, submitButton, { loadingText: loadingText }); //смена надписи кнопки
  request()
    .then((formFill) => {
      hideModal(popup, handleHide); //тоже сюда, т.к. нужно прятать модальное окно при всех обстоятельствах
      renderLoading(false, submitButton, {
        commonText: initialText,
      });
      if (formFill) {
        //если был вернут объект для заполнения, то заполнить форму
        Object.keys(formFill).forEach((key) => {
          if (key !== 'form') {
            formFill.form.elements[key].value = formFill[key];
          }
        });
      } else {
        evt.target.reset();
      }
    })
    .catch((error) => {
      console.error(error);
      renderLoading(false, submitButton, {
        isError: true,
        errorText: error,
      }); //смена надписи на предложение повторить
    });
};
