/* * * * * * * * * * * * * * * * * * * * * * * *
 * form-validator.js
 */
class FormValidator {
  constructor(formElement) {
    this.formElement = formElement;
    this.addCustomErrorMessages();
    this.init();
  }

  addCustomErrorMessages() {
    const nameFieldElement = this.formElement.querySelector('[data-name="name"]');
    const surnameFieldElement = this.formElement.querySelector('[data-name="surname"]');
    const addressFieldElement = this.formElement.querySelector('[data-name="address"]');
    const phoneFieldElement = this.formElement.querySelector('[data-name="phone"]');
    const emailFieldElement = this.formElement.querySelector('[data-name="email"]');
    const messageFieldElement = this.formElement.querySelector('[data-name="message"]');

    const simpleFormFieldElement = this.formElement.querySelector('.simple-form__control');

    if (simpleFormFieldElement) {
      simpleFormFieldElement.closest('.simple-form').classList.add('pristine-item');
      simpleFormFieldElement.dataset.pristineRequiredMessage = 'Заполните это поле.';

      if (simpleFormFieldElement.type === 'email') {
        simpleFormFieldElement.dataset.pristineEmailMessage = 'Введите корректный e-mail адрес.';
      }
    }

    if (nameFieldElement) {
      nameFieldElement.closest('.text-field').classList.add('pristine-item');
      nameFieldElement.dataset.pristinePattern = '/^[a-zа-яЁё -]+$/i';
      nameFieldElement.dataset.pristineRequiredMessage = 'Заполните это поле.';
      nameFieldElement.dataset.pristinePatternMessage = 'Допустимы только буквы, дефисы и пробелы.';
    }

    if (surnameFieldElement) {
      surnameFieldElement.closest('.text-field').classList.add('pristine-item');
      surnameFieldElement.dataset.pristinePattern = '/^[a-zа-яЁё -]+$/i';
      surnameFieldElement.dataset.pristineRequiredMessage = 'Заполните это поле.';
      surnameFieldElement.dataset.pristinePatternMessage = 'Допустимы только буквы, дефисы и пробелы.';
    }

    if (addressFieldElement) {
      addressFieldElement.closest('.text-field').classList.add('pristine-item');
      addressFieldElement.dataset.pristineRequiredMessage = 'Заполните это поле.';
    }

    if (phoneFieldElement) {
      phoneFieldElement.closest('.text-field').classList.add('pristine-item');
      phoneFieldElement.dataset.pristineRequiredMessage = 'Заполните это поле.';
    }

    if (emailFieldElement) {
      emailFieldElement.closest('.text-field').classList.add('pristine-item');
      emailFieldElement.dataset.pristineRequiredMessage = 'Заполните это поле.';
      emailFieldElement.dataset.pristineEmailMessage = 'Введите корректный e-mail адрес.';
    }

    if (messageFieldElement) {
      messageFieldElement.closest('.text-area').classList.add('pristine-item');
      messageFieldElement.dataset.pristineRequiredMessage = 'Заполните это поле.';
    }
  }

  validate() {
    return this.pristine.validate();
  }

  reset() {
    this.pristine.reset();
    this.formElement.querySelectorAll('.shake').forEach((element) => element.classList.remove('shake'));
  }

  init() {
    this.pristine = new Pristine(this.formElement, {
      classTo: 'pristine-item',
      errorClass: 'pristine-item--invalid',
      errorTextParent: 'pristine-item',
      errorTextTag: 'p',
      errorTextClass: 'pristine-item__error-text',
    });
  }
}
/* * * * * * * * * * * * * * * * * * * * * * * */
