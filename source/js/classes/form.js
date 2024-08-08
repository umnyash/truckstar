/* * * * * * * * * * * * * * * * * * * * * * * *
 * form.js
 */
class Form {
  constructor(formElement) {
    this.formElement = formElement;
    this.formInnerElement = this.formElement.querySelector('[data-form-inner]')
    this.textFieldControlElements = this.formElement.querySelectorAll('.text-field__control');
    this.actionUrl = this.formElement.action;
    this.submitButtonElement = this.formElement.querySelector('[data-submit-button]');
    this.validator = new FormValidator(this.formElement);
    this.successHandler = null;
    this.errorHandler = null;
    this.init();
  }

  setHandlers = (successHandler, errorHandler) => {
    this.successHandler = successHandler;
    this.errorHandler = errorHandler;
  };

  init = () => {
    this.formElement.addEventListener('submit', (evt) => {
      evt.preventDefault();

      const isValid = this.validator.validate();

      if (isValid) {
        this.submitButtonElement.disabled = true;
        this.submitButtonElement.classList.add('button--pending');

        sendData(
          this.actionUrl,
          new FormData(evt.target),
          (data) => {
            this.formElement.reset();
            this.successHandler(data);
          },
          (data) => {
            this.errorHandler(data);
          },
          () => {
            this.submitButtonElement.disabled = false;
            this.submitButtonElement.classList.remove('button--pending');
          }
        );
      } else {
        this.formInnerElement.classList.remove('shake');
        setTimeout(() => this.formInnerElement.classList.add('shake'), 50);
      }
    });

    this.formElement.addEventListener('reset', () => {
      setTimeout(() => {
        this.textFieldControlElements.forEach((textFieldElement) => {
          textFieldElement.dispatchEvent(inputEvent);
        });
        this.validator.reset();
      }, 0)
    });
  };
}
