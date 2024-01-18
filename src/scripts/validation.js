const getErrorElement = (form, input) =>
  form.querySelector(`.${form.getAttribute('name')}__${input.name}--error`);
const getSubmitButton = (form) =>
  Array.from(form.elements).find((button) => button.type === 'submit');

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

const showErrorMessage = (input, classes, errorElement) => {
  input.classList.add(classes.inputErrorClass);
  errorElement.textContent = input.validationMessage;
  errorElement.classList.add(classes.errorClass);
};
const hideErrorMessage = (input, classes, errorElement) => {
  input.classList.remove(classes.inputErrorClass);
  errorElement.textContent = '';
  errorElement.classList.remove(classes.errorClass);
};
const setErrorMessage = (input, message) => {
  input.setCustomValidity(message);
};

const isValidInput = (form, input) => {
  if (input.validity.patternMismatch) {
    if (input.dataset.patternError) {
      setErrorMessage(input, input.dataset.patternError);
    } else {
      console.log(
        `WARNING: error message for pattern is missing in the markup of the input ${
          input.name
        } in the form ${form.getAttribute('name')}`
      ); //сообщение в консоль на случай отсутствия сообщения ошибки в вёрстке
    }
  } else {
    setErrorMessage(input, '');
  }
  return input.validity.valid;
};

const isValidForm = (form, classes) => {
  return Array.from(form.elements).every((input) => {
    if (input.nodeName === 'INPUT') {
      return isValidInput(form, input, classes);
    } else {
      return true;
    }
  });
};

const validateInput = (form, input, classes, errorElement) => {
  if (isValidInput(form, input, classes)) {
    hideErrorMessage(input, classes, errorElement);
  } else {
    showErrorMessage(input, classes, errorElement);
  }
};

const setFormListeners = (form, classes) => {
  const submitButton = Array.from(form.elements).find(
    (button) => button.type === 'submit'
  );
  Array.from(form.elements).forEach((input) => {
    if (input.nodeName === 'INPUT') {
      let errorElement = getErrorElement(form, input, classes);
      input.addEventListener('input', () => {
        validateInput(form, input, classes, errorElement, submitButton);
        if (isValidForm(form, classes)) {
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
  disableButton(getSubmitButton(form), classes.inactiveButtonClass);
  Array.from(form.elements).forEach((input) => {
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
