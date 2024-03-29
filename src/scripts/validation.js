const getErrorElement = (form, input) =>
  form.querySelector(`.${form.getAttribute('name')}__${input.name}--error`);
const getSubmitButton = (form) =>
  Array.from(form.elements).find((button) => button.type === 'submit');

//включить и выключить кнопку с назначением и снятием класса
const disableButton = (button, inactiveButtonClass) => {
  if (!button.hasAttribute('disabled')) {
    button.setAttribute('disabled', '');
    button.classList.add(inactiveButtonClass);
  }
};
const enableButton = (button, inactiveButtonClass) => {
  if (button.hasAttribute('disabled')) {
    button.removeAttribute('disabled');
    button.classList.remove(inactiveButtonClass);
  }
};

const setErrorMessage = (input, message) => {
  //функция установки кастомного сообщения об ошибке
  input.setCustomValidity(message);
};
const showErrorMessage = (input, classes, errorElement) => {
  //показать сообщение об ошибке валидации
  errorElement.textContent = input.validationMessage;
  errorElement.classList.add(classes.errorClass);
  input.classList.add(classes.inputErrorClass);
};
const hideErrorMessage = (input, classes, errorElement) => {
  //скрыть сообщение об ошибке валидации
  errorElement.textContent = '';
  errorElement.classList.remove(classes.errorClass);
  input.classList.remove(classes.inputErrorClass);
};

const isValidInput = (input) => {
  //вывод валидности конкретного инпута
  if (input.validity.patternMismatch) {
    if (input.dataset.patternError) {
      setErrorMessage(input, input.dataset.patternError);
    } else {
      console.log(
        `WARNING: error message for pattern is missing in the markup of the input ${input.name}`
      ); //сообщение в консоль на случай отсутствия сообщения ошибки в вёрстке
    }
  } else {
    setErrorMessage(input, '');
  }
  return input.validity.valid;
};

const validateInput = (input, classes, errorElement) => {
  //непосредственно валидация инпута с выводом ошибок
  if (isValidInput(input)) {
    hideErrorMessage(input, classes, errorElement);
  } else {
    showErrorMessage(input, classes, errorElement);
  }
};

const isValidForm = (elementsArray) => {
  //вывод валидности формы
  return elementsArray.every((input) =>
    input.nodeName === 'INPUT' ? isValidInput(input) : true
  );
};

const setFormListeners = (form, classes) => {
  //назначить слушатели всем формам
  const formElementsArray = Array.from(form.elements);
  const submitButton = formElementsArray.find(
    (button) => button.type === 'submit'
  ); //поиск кнопки заранее, чтобы передать в качестве аргумента. Сделано для избегания многократного её поиска
  const handleFormReset = () => {
    formElementsArray.forEach((input) => {
      if (input.nodeName === 'INPUT') {
        hideErrorMessage(input, classes, getErrorElement(form, input, classes));
      }
    });
    disableButton(submitButton, classes.inactiveButtonClass);
  };
  form.addEventListener('reset', handleFormReset); //UPDATE: теперь инактивация кнопки по событию сброса формы, а также сброс полей ошибок
  formElementsArray.forEach((input) => {
    if (input.nodeName === 'INPUT') {
      const errorElement = getErrorElement(form, input, classes);
      input.addEventListener('input', () => {
        validateInput(input, classes, errorElement, submitButton);
        if (isValidForm(formElementsArray)) {
          enableButton(submitButton, classes.inactiveButtonClass);
        } else {
          disableButton(submitButton, classes.inactiveButtonClass);
        }
      });
    }
  });
};

export const enableValidation = (formClasses) => {
  const formsArray = Array.from(
    document.querySelectorAll(formClasses.formSelector)
  );
  formsArray.forEach((form) => {
    setFormListeners(form, formClasses);
  });
};

export const clearValidation = (form, classes) => {
  const formElementsArray = Array.from(form.elements);
  (isValidForm(formElementsArray) ? enableButton : disableButton)(
    getSubmitButton(form),
    classes.inactiveButtonClass
  );
  formElementsArray.forEach((input) => {
    if (input.nodeName === 'INPUT') {
      hideErrorMessage(input, classes, getErrorElement(form, input, classes));
    }
  });
};

/*
export const setFormValid = (form, classes) => {
  enableButton(getSubmitButton(form), classes.inactiveButtonClass);
  Array.from(form.elements).forEach(input=>{
    if (input.nodeName==="INPUT") {
      hideErrorMessage(input, classes, getErrorElement(form, input, classes));
    }
  })
};
*/
