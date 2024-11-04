/* * * * * * * * * * * * * * * * * * * * * * * *
 * form-validator.js
 */
class FormValidator {
  constructor(formElement) {
    this.formElement = formElement;

    this.dropdowns = Array.from(this.formElement.querySelectorAll('.dropdown')).map((dropdownElement) => {
      const radiobuttonElements = Array.from(dropdownElement.querySelectorAll('.dropdown__option-control'));
      const isRequired = radiobuttonElements.some((radiobuttonElement) => radiobuttonElement.required);
      const checkedElement = radiobuttonElements.find((radiobuttonElement) => radiobuttonElement.checked);

      if (isRequired) {
        radiobuttonElements.forEach((radiobuttonElement) => radiobuttonElement.required = false);
      }

      return {
        element: dropdownElement,
        radiobuttonElements,
        checkedElement,
        isRequired
      };
    });

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

  resetDropdownValidation(dropdownElement) {
    dropdownElement.querySelector('.pristine-item__error-text')?.remove();
    dropdownElement.classList.remove('pristine-item--invalid');
    dropdownElement.classList.remove('shake');
  }

  validateDropdown = (dropdown) => {
    const { element, radiobuttonElements, isRequired } = dropdown;

    if (!isRequired) {
      return true;
    }

    const isСhecked = radiobuttonElements.some((radiobuttonElement) => radiobuttonElement.checked);

    if (isСhecked) {
      this.resetDropdownValidation(dropdown.element);
    } else {
      element.querySelector('.pristine-item__error-text')?.remove();
      element.classList.add('pristine-item--invalid');
      element.insertAdjacentHTML('beforeend', '<p class="pristine-item__error-text">Выберите один из вариантов.</p>')
    }

    return isСhecked;
  };

  validateDropdowns = () => {
    let isValid = true;

    this.dropdowns.forEach((dropdown) => {
      if (this.validateDropdown(dropdown)) {
        return;
      }

      isValid = false;
    })

    return isValid;
  };

  resetDropdownsValidation = () => {
    this.dropdowns.forEach((dropdown) => this.resetDropdownValidation(dropdown.element))
  };

  validate = () => {
    const dropdownsIsValid = this.validateDropdowns();
    return this.pristine.validate() && dropdownsIsValid;
  };

  reset = () => {
    this.pristine.reset();
    this.formElement.querySelectorAll('.shake').forEach((element) => element.classList.remove('shake'));
    this.resetDropdownsValidation();

    this.dropdowns.forEach((dropdown) => {
      const toggleButtonTextElement = dropdown.element.querySelector('.dropdown__toggle-button-text');
      toggleButtonTextElement.textContent = dropdown.checkedElement
        ? dropdown.checkedElement.parentElement.querySelector('.dropdown__option-label').textContent
        : toggleButtonTextElement.dataset.label;
    });
  };

  onFormChange = (evt) => {
    const dropdownElement = evt.target.closest('.dropdown');

    if (dropdownElement) {
      this.resetDropdownValidation(dropdownElement);
    }
  };

  init() {
    this.pristine = new Pristine(this.formElement, {
      classTo: 'pristine-item',
      errorClass: 'pristine-item--invalid',
      errorTextParent: 'pristine-item',
      errorTextTag: 'p',
      errorTextClass: 'pristine-item__error-text',
    });

    this.formElement.addEventListener('change', this.onFormChange);
  }
}
/* * * * * * * * * * * * * * * * * * * * * * * */
