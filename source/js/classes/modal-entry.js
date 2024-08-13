/* * * * * * * * * * * * * * * * * * * * * * * *
 * modal-entry.js
 */
class ModalEntry extends Modal {
  resendTimeInterval = 4;
  timer = 0;

  constructor(modalElement) {
    super(modalElement);

    this.backButtonElement = modalElement.querySelector('.modal__button--back');
    this.backButtonElement.addEventListener('click', (evt) => {
      evt.preventDefault();
      this.switchStep(1);
    });

    this.codeFormElement = modalElement.querySelector('.modal-entry__form--code');
    this.codeForm = new Form(this.codeFormElement);
    this.phoneFieldElement = this.codeFormElement.querySelector('[data-name="phone"]');

    this.loginFormElement = modalElement.querySelector('.modal-entry__form--login');
    this.loginForm = new Form(this.loginFormElement);
    this.currentPhoneTextElement = this.loginFormElement.querySelector('[data-current-phone-text]');
    this.codeFieldElement = this.loginFormElement.querySelector('[data-name="code"]');
    this.resendElement = this.loginFormElement.querySelector('.modal-form__resend');
    this.resendTimerElement = this.resendElement.querySelector('.modal-form__resend-timer');
    this.resendButtonElement = this.resendElement.querySelector('.modal-form__resend-button');
    this.loginFormSubmitButtonElement = this.loginFormElement.querySelector('[data-submit-button]');

    this.codeFieldElement.addEventListener('input', (evt) => {
      if (evt.target.value.length > CODE_LENGTH) {
        evt.target.value = evt.target.value.slice(0, CODE_LENGTH);
      }

      if (this.loginFormSubmitButtonElement.classList.contains('button--pending')) {
        return;
      }

      this.loginFormSubmitButtonElement.disabled = !evt.target.value;
    });

    this.switchStep(1);

    this.resendButtonElement.addEventListener('click', (evt) => {
      evt.preventDefault();
      this.codeFormElement.requestSubmit();
      // this.startTimer();
    });
  }

  startTimer = () => {
    if (this.timer <= 0) {
      this.timer = this.resendTimeInterval;
      this.resendTimerElement.textContent = this.timer;
      this.resendElement.classList.add('modal-form__resend--waiting');

      const timerId = setInterval(() => {
        this.timer--;
        this.resendTimerElement.textContent = this.timer;

        if (this.timer <= 0) {
          clearInterval(timerId);
          this.resendElement.classList.remove('modal-form__resend--waiting');
        }
      }, 1000);
    }
  }

  switchStep = (step) => {
    if (step === 1) {
      this.backButtonElement.classList.add('modal__button--hidden');
      this.codeFormElement.classList.remove('modal-entry__form--hidden');
      this.loginFormElement.classList.add('modal-entry__form--hidden');
    } else if (step === 2) {
      this.startTimer();
      const formattedPhone = this.phoneFieldElement.value.replace(/[()]/g, '').replace(/-/g, ' ');
      this.currentPhoneTextElement.textContent = formattedPhone;
      this.backButtonElement.classList.remove('modal__button--hidden');
      this.codeFormElement.classList.add('modal-entry__form--hidden');
      this.loginFormElement.classList.remove('modal-entry__form--hidden');
    }
  }

  // setCodeFormHandlers = (successHandler, errorHandler) => {
  //   this.codeForm.setHandlers(
  //     () => {
  //       successHandler();
  //       this.modalElement.close();
  //     },
  //     () => {
  //       errorHandler();
  //     });
  // };

  // setHandlers = (successHandler, errorHandler) => {
  //   this.form.setHandlers(
  //     () => {
  //       successHandler();
  //       this.modalElement.close();
  //     },
  //     () => {
  //       errorHandler();
  //     });
  // };
}
/* * * * * * * * * * * * * * * * * * * * * * * */
