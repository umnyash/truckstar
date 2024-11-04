/* * * * * * * * * * * * * * * * * * * * * * * *
 * form.js
 */
class Form extends PubSub {
  constructor(formElement) {
    super();
    this.formElement = formElement;
    this.textFieldControlElements = this.formElement.querySelectorAll('.text-field__control, .simple-form__control, .text-area__control');
    this.imagesFieldElement = this.formElement.querySelector('.images-field');
    this.imagesField = null;
    this.actionUrl = this.formElement.action;
    this.submitButtonElement = this.formElement.querySelector('[data-submit-button]');
    this.validator = new FormValidator(this.formElement);
    this.siteHeaderElement = document.querySelector('.page__site-header');
    this.successHandler = null;
    this.errorHandler = null;
    this.init();
  }

  setHandlers = (successHandler, errorHandler) => {
    this.successHandler = successHandler;
    this.errorHandler = errorHandler;
  };

  init = () => {
    if (this.imagesFieldElement) {
      this.imagesField = new ImagesField(this.imagesFieldElement);
    }

    this.formElement.addEventListener('submit', (evt) => {
      evt.preventDefault();

      const isValid = this.validator.validate();

      if (isValid) {
        this.emit(FormEvents.SUBMIT_START);
        this.submitButtonElement.disabled = true;
        this.submitButtonElement.classList.add('button--pending');

        const formData = new FormData(evt.target);

        this.imagesField?.images?.forEach((file) => {
          formData.append('images[]', file);
        });

        sendData(
          this.actionUrl,
          formData,
          (data) => {
            this.successHandler(data);

            if (!this.formElement.matches('.modal-entry__form--code')) {
              this.formElement.reset();
            }
          },
          (data) => {
            this.errorHandler(data);
          },
          () => {
            this.emit(FormEvents.SUBMIT_END);
            this.submitButtonElement.disabled = false;
            this.submitButtonElement.classList.remove('button--pending');
          }
        );
      } else {
        if (this.formElement.matches('.simple-form')) {
          const fieldWrapperElement = this.formElement.querySelector('.simple-form__inner');
          fieldWrapperElement.classList.remove('shake');
          requestAnimationFrame(() => fieldWrapperElement.classList.add('shake'));
          fieldWrapperElement.querySelector('input').focus();
        } else {
          const firstInvalidItemElement = this.formElement.querySelector('.pristine-item--invalid');
          const modalElement = firstInvalidItemElement?.closest('.modal');

          if (modalElement) {
            modalElement.scrollTo({
              top: firstInvalidItemElement.offsetTop,
              behavior: 'smooth',
            })
          } else {
            window.scrollTo({
              top: firstInvalidItemElement.offsetTop - this.siteHeaderElement.offsetHeight,
              behavior: 'smooth',
            })
          }
          firstInvalidItemElement.querySelector('input, textarea').focus();
          firstInvalidItemElement.classList.remove('shake');
          requestAnimationFrame(() => firstInvalidItemElement.classList.add('shake'));
        }
      }
    });

    this.formElement.addEventListener('reset', () => {
      setTimeout(() => {
        this.textFieldControlElements?.forEach((textFieldElement) => {
          textFieldElement.dispatchEvent(inputEvent);
        });
        this.imagesField?.reset();
        this.validator.reset();
      }, 0)
    });
  };
}
