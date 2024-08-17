"use strict";

const LAPTOP_WIDTH_MEDIA_QUERY = '(min-width: 1280px)';
const DESKTOP_WIDTH_MEDIA_QUERY = '(min-width: 1366px)';
const MEDIUM_INTERACTION_DURATION = 400;
const MODAL_ANIMATION_DURATION = 500; // Соответствует $modal-animation-duration в variables.scss
const CODE_LENGTH = 4;
const FormEvents = {
  SUBMIT_START: 'formSubmitStart',
  SUBMIT_END: 'formSubmitEnd'
};
const PHOTO_TYPES = ['jpg', 'jpeg', 'png'];
function lockPageScroll() {
  const bodyWidth = document.body.clientWidth;
  document.body.classList.add('scroll-lock');
  if (document.body.clientWidth === bodyWidth) {
    return;
  }
  document.body.style.paddingRight = `${document.body.clientWidth - bodyWidth}px`;
}
function unlockPageScroll() {
  document.body.classList.remove('scroll-lock');
  document.body.style.paddingRight = '0';
}
function getPaginationButtonCreator() {
  let slideName = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'Слайд';
  return (index, className) => `
    <button class='${className}' type='button'>
      <span class='visually-hidden'>${slideName} ${index + 1}.</span>
    </button>
  `;
}
function debounce(callback) {
  var _this = this;
  let timeoutDelay = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 500;
  let timeoutId;
  return function () {
    for (var _len = arguments.length, rest = new Array(_len), _key = 0; _key < _len; _key++) {
      rest[_key] = arguments[_key];
    }
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => callback.apply(_this, rest), timeoutDelay);
  };
}
function throttle(callback, delay) {
  var _this2 = this;
  let lastTime = 0;
  let timeoutId;
  return function () {
    for (var _len2 = arguments.length, rest = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      rest[_key2] = arguments[_key2];
    }
    const now = new Date();
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => callback.apply(_this2, rest), delay);
    if (now - lastTime >= delay) {
      callback.apply(_this2, rest);
      lastTime = now;
    }
  };
}
function createElementByString(template) {
  const newElement = document.createElement('div');
  newElement.innerHTML = template;
  return newElement.firstElementChild;
}

/* * * * * * * * * * * * * * * * * * * * * * * *
 * api.js
 */
async function sendData(url, body) {
  let onSuccess = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : () => {};
  let onFail = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : () => {};
  let onFinally = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : () => {};
  try {
    const response = await fetch(url, {
      method: 'POST',
      body
    });
    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`${response.status} – ${response.statusText}: ${errorData}`);
    }
    const data = await response.json();
    onSuccess(data);
  } catch (err) {
    console.error(err.message);
    onFail();
  } finally {
    onFinally();
  }
}
/* * * * * * * * * * * * * * * * * * * * * * * */

class PubSub {
  constructor() {
    this.listeners = {};
  }
  addListener(event, fn) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(fn);
  }
  removeListener(event, fn) {
    if (!this.listeners[event]) {
      return;
    }
    this.listeners[event] = this.listeners[event].filter(listener => listener !== fn);
  }
  emit(event, data) {
    if (!this.listeners[event]) {
      return;
    }
    this.listeners[event].forEach(listener => listener(data));
  }
}

/* * * * * * * * * * * * * * * * * * * * * * * *
 * modal.js
 */
class Modal {
  static openModalsCount = 0;
  constructor(modalElement) {
    let {
      onOpenerClick
    } = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    this.modalElement = modalElement;
    this.name = modalElement?.dataset.modal;
    this.initOpeners();
    this.modalElement.addEventListener('close', () => this.onModalClose());
    this.onOpenerClick = onOpenerClick;
    this.modalElement.addEventListener('click', evt => {
      if (evt.target === this.modalElement || evt.target.closest('[data-modal-close-button]')) {
        evt.preventDefault();
        this.close();
      }
    });
    if (!document.body.contains(this.modalElement)) {
      document.body.append(this.modalElement);
    }
  }
  initOpeners = () => {
    const openerElements = document.querySelectorAll(`[data-modal-opener="${this.name}"]`);
    openerElements.forEach(openerElement => {
      openerElement.addEventListener('click', evt => {
        evt.preventDefault();
        if (this.onOpenerClick) {
          this.onOpenerClick(evt);
        }
        this.open();
      });
    });
  };
  open = () => {
    lockPageScroll();
    requestAnimationFrame(() => {
      this.modalElement.showModal();
      Modal.openModalsCount++;
    });
  };
  close = () => {
    this.modalElement.close();
  };
  onModalClose = () => {
    Modal.openModalsCount--;
    setTimeout(() => {
      if (!Modal.openModalsCount) {
        unlockPageScroll();
      }
      if (this.modalElement.classList.contains('modal--with_alert')) {
        this.modalElement.remove();
        this.modalElement = null;
      }
    }, MODAL_ANIMATION_DURATION);
  };
}
/* * * * * * * * * * * * * * * * * * * * * * * */

/* * * * * * * * * * * * * * * * * * * * * * * *
 * alert.js
 */
class Alert extends Modal {
  constructor(_ref) {
    let {
      heading,
      status = 'success',
      mode,
      text
    } = _ref;
    const modalElement = Alert.createElement({
      heading,
      status,
      mode,
      text
    });
    document.body.append(modalElement);
    super(modalElement);
    this.button = modalElement.querySelector('.alert__button');
  }
  static createElement(_ref2) {
    let {
      heading,
      status,
      mode,
      text
    } = _ref2;
    const modalString = `
      <dialog class="modal modal--position_center modal--with_alert">
        <div class="modal__inner">
          <button class="modal__button modal__button--close" type="button" data-modal-close-button>
            <span class="visually-hidden">Закрыть</span>
          </button>
          <section class="alert modal__alert ${status === 'error' ? 'alert--error' : ''} ${mode === 'alter' ? 'alert--alter' : ''}">
            <h2 class="alert__heading heading">${heading}</h2>
            ${text ? `<p class="alert__text">${text}</p>` : ''}
            <button class="alert__button button button--secondary button--right button--size_l" type="button" ${status === 'success' && 'data-modal-close-button'}>
              <span class="button__inner">${status === 'error' ? 'Повторить' : 'Закрыть'}<span class="button__icon"></span></span>
            </button>
          </section>
        </div>
      </dialog>
    `;
    return createElementByString(modalString);
  }
}
/* * * * * * * * * * * * * * * * * * * * * * * */

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
    this.formElement.querySelectorAll('.shake').forEach(element => element.classList.remove('shake'));
  }
  init() {
    this.pristine = new Pristine(this.formElement, {
      classTo: 'pristine-item',
      errorClass: 'pristine-item--invalid',
      errorTextParent: 'pristine-item',
      errorTextTag: 'p',
      errorTextClass: 'pristine-item__error-text'
    });
  }
}
/* * * * * * * * * * * * * * * * * * * * * * * */

/* * * * * * * * * * * * * * * * * * * * * * * *
 * form.js
 */
class Form extends PubSub {
  constructor(formElement) {
    super();
    this.formElement = formElement;
    this.textFieldControlElements = this.formElement.querySelectorAll('.text-field__control, .simple-form__control, .text-area__control');
    this.imagesFieldElement = this.formElement.querySelector('.images-field');
    this.imagesFieldListElement = this.formElement.querySelector('.images-field__list');
    this.actionUrl = this.formElement.action;
    this.submitButtonElement = this.formElement.querySelector('[data-submit-button]');
    this.validator = new FormValidator(this.formElement);
    this.siteHeaderElement = document.querySelector('.page__site-header');
    this.successHandler = null;
    this.errorHandler = null;
    this.imagesFieldErrorTextElement = null;
    this.init();
  }
  setHandlers = (successHandler, errorHandler) => {
    this.successHandler = successHandler;
    this.errorHandler = errorHandler;
  };
  resetImagesField = () => {
    if (this.imagesFieldListElement) {
      this.imagesFieldListElement.querySelectorAll('img').forEach(imageElement => {
        URL.revokeObjectURL(imageElement.src);
      });
      this.imagesFieldListElement.innerHTML = '';
    }
    if (this.images) {
      this.images.clear();
    }
  };
  initImagesField = fieldElement => {
    const controlElement = fieldElement.querySelector('.images-field__control');
    const listElement = fieldElement.querySelector('.images-field__list');
    this.images = new Set();
    controlElement.addEventListener('change', evt => {
      this.imagesFieldErrorTextElement?.remove();
      const newFiles = Array.from(evt.target.files);
      newFiles.forEach(file => {
        if (file.type.startsWith('image/') && PHOTO_TYPES.some(it => file.name.toLowerCase().endsWith(it))) {
          this.images.add(file);
        } else {
          this.imagesFieldErrorTextElement = createElementByString(`<p class="images-field__error-text">Не удалось загрузить фото, попробуйте снова</p>`);
          listElement.insertAdjacentElement('beforebegin', this.imagesFieldErrorTextElement);
        }
      });
      updateList();
    });
    const updateList = () => {
      const fragment = document.createDocumentFragment();
      this.images.forEach(file => {
        const listItemElement = createElementByString(`
          <li class="images-field__list-item">
            <img class="images-field__preview" src=${URL.createObjectURL(file)} alt=''>
            <button class="images-field__delete-button image-button image-button--size_xs image-button--primary image-button--icon_cross" type="button">
              <span class="visually-hidden">Удалить фото</span>
            </button>
          </li>
        `);
        const previewElement = listItemElement.querySelector('.images-field__preview');
        const deleteButtonElement = listItemElement.querySelector('.images-field__delete-button');
        deleteButtonElement.addEventListener('click', evt => {
          this.images.delete(file);
          updateList();
          URL.revokeObjectURL(previewElement.src);
        });
        fragment.append(listItemElement);
      });
      listElement.innerHTML = '';
      listElement.append(fragment);
    };
  };
  init = () => {
    if (this.imagesFieldElement) {
      this.initImagesField(this.imagesFieldElement);
    }
    this.formElement.addEventListener('submit', evt => {
      evt.preventDefault();
      const isValid = this.validator.validate();
      if (isValid) {
        console.log('Форма валидна');
        this.emit(FormEvents.SUBMIT_START);
        this.submitButtonElement.disabled = true;
        this.submitButtonElement.classList.add('button--pending');
        const formData = new FormData(evt.target);
        this.images?.forEach(file => {
          formData.append('images[]', file);
        });
        sendData(this.actionUrl, formData, data => {
          this.successHandler(data);
          if (!this.formElement.matches('.modal-entry__form--code')) {
            this.formElement.reset();
          }
        }, data => {
          this.errorHandler(data);
        }, () => {
          this.emit(FormEvents.SUBMIT_END);
          this.submitButtonElement.disabled = false;
          this.submitButtonElement.classList.remove('button--pending');
        });
      } else {
        console.log('Форма невалидна');
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
              behavior: 'smooth'
            });
          } else {
            window.scrollTo({
              top: firstInvalidItemElement.offsetTop - this.siteHeaderElement.offsetHeight,
              behavior: 'smooth'
            });
          }
          firstInvalidItemElement.querySelector('input, textarea').focus();
          firstInvalidItemElement.classList.remove('shake');
          requestAnimationFrame(() => firstInvalidItemElement.classList.add('shake'));
        }
      }
    });
    this.formElement.addEventListener('reset', () => {
      setTimeout(() => {
        this.textFieldControlElements?.forEach(textFieldElement => {
          textFieldElement.dispatchEvent(inputEvent);
        });
        this.resetImagesField();
        this.validator.reset();
      }, 0);
    });
  };
}

/* * * * * * * * * * * * * * * * * * * * * * * *
 * modal-form.js
 */
class ModalForm extends Modal {
  constructor(modalElement) {
    super(modalElement);
    this.formElement = modalElement.querySelector('.modal-form');
    this.form = new Form(this.formElement);
  }
  setHandlers = (successHandler, errorHandler) => {
    this.form.setHandlers(() => {
      successHandler();
      this.modalElement.close();
    }, () => {
      errorHandler();
    });
  };
}

/* * * * * * * * * * * * * * * * * * * * * * * *
 * modal-entry.js
 */
class ModalEntry extends Modal {
  resendTimeInterval = 4;
  timer = 0;
  constructor(modalElement) {
    super(modalElement);
    this.backButtonElement = modalElement.querySelector('.modal__button--back');
    this.backButtonElement.addEventListener('click', evt => {
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
    this.codeFieldElement.addEventListener('input', evt => {
      if (evt.target.value.length > CODE_LENGTH) {
        evt.target.value = evt.target.value.slice(0, CODE_LENGTH);
      }
      if (this.loginFormSubmitButtonElement.classList.contains('button--pending')) {
        return;
      }
      this.loginFormSubmitButtonElement.disabled = !evt.target.value;
    });
    this.switchStep(1);
    this.resendButtonElement.addEventListener('click', evt => {
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
  };
  switchStep = step => {
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
  };

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

/* * * * * * * * * * * * * * * * * * * * * * * *
 * cart.js
 */
class Cart {
  constructor(cartElement) {
    this.siteHeaderElement = document.querySelector('.page__site-header');
    this.cartElement = cartElement;
    this.formElement = this.cartElement.querySelector('.cart__form');
    this.init();
  }
  toggleFormFooterStickiness = () => {
    if (laptopWidthMediaQueryList.matches) {
      return;
    }
    const documentHeight = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight, document.body.offsetHeight, document.documentElement.offsetHeight, document.body.clientHeight, document.documentElement.clientHeight);
    const windowHeight = document.documentElement.clientHeight;
    const scrollPosition = window.scrollY;
    const isAtBottom = windowHeight + scrollPosition >= documentHeight;
    this.formFooterElement.classList.toggle('cart-form__footer--sticked', !isAtBottom);
  };
  setPageBottomIndent = () => {
    if (!laptopWidthMediaQueryList.matches) {
      const bottomValue = parseFloat(getComputedStyle(this.formFooterElement).bottom);
      document.body.style.paddingBottom = `${this.formFooterElement.offsetHeight + bottomValue}px`;
    } else {
      document.body.style.paddingBottom = 0;
    }
  };
  onWindowResize = debounce(this.setPageBottomIndent, 500);
  onWindowScroll = throttle(this.toggleFormFooterStickiness, 100);
  onReceivingMethodSectionChange = evt => {
    if (evt.target.dataset.value === 'delivery') {
      this.receivingMethodSectionElement.insertAdjacentElement('afterend', this.deliverySectionElement);
      this.form.validator.reset();
      this.form.validator.init();
    } else {
      this.deliverySectionElement.remove();
      this.form.validator.reset();
      this.form.validator.init();
    }
  };
  init() {
    if (!this.formElement) {
      return;
    }
    this.formFooterElement = this.formElement.querySelector('.cart-form__footer');
    this.form = new Form(this.formElement);
    this.productsList = this.formElement.querySelector('.cart-form__products-list');
    this.deliverySectionElement = this.formElement.querySelector('[data-delivery-section]');
    this.receivingMethodSectionElement = this.formElement.querySelector('[data-receiving-method-section]');
    this.deliverySectionElement.querySelectorAll('.text-field').forEach(initTextField);
    this.deliverySectionElement.remove();
    this.form.validator.init();
    this.setPageBottomIndent();
    this.toggleFormFooterStickiness();
    window.addEventListener('resize', this.onWindowResize);
    window.addEventListener('scroll', this.onWindowScroll);
    this.receivingMethodSectionElement.addEventListener('change', this.onReceivingMethodSectionChange);
  }
}
/* * * * * * * * * * * * * * * * * * * * * * * */

/* * * * * * * * * * * * * * * * * * * * * * * *
 * banner-slider.js
 */
function initBannerSlider(sliderElement) {
  new Swiper(sliderElement, {
    effect: 'fade',
    fadeEffect: {
      crossFade: true
    },
    loop: true,
    speed: 1400,
    allowTouchMove: false,
    autoplay: {
      delay: 1000,
      disableOnInteraction: false
    }
  });
}
/* * * * * * * * * * * * * * * * * * * * * * * */

/* * * * * * * * * * * * * * * * * * * * * * * *
 * catalog-navigation.js
 */
function initCatalogNavigation(navigationElement) {
  const innerElement = navigationElement.querySelector('.catalog-navigation__inner');
  const listWrapperElement = innerElement.querySelector('.catalog-navigation__list');
  const openerElement = document.querySelector('.catalog__navigation-opener');
  const laptopWidthMediaQueryList = window.matchMedia(LAPTOP_WIDTH_MEDIA_QUERY);
  let unlockingPageTimer = null;
  new SimpleBar(listWrapperElement, {
    autoHide: false
  });
  innerElement.addEventListener('click', evt => {
    const groupToggleButton = evt.target.closest('.catalog-navigation__group-heading');
    if (groupToggleButton) {
      evt.preventDefault();
      const groupElement = groupToggleButton.closest('.catalog-navigation__group');
      groupElement.classList.toggle('catalog-navigation__group--open');
    } else if (evt.target.closest('.catalog-navigation__close-button')) {
      close();
    }
  });
  function onLaptopWidthMediaQueryListChange() {
    close();
  }
  function open() {
    if (!laptopWidthMediaQueryList.matches) {
      lockPageScroll();
    }
    clearTimeout(unlockingPageTimer);
    navigationElement.classList.remove('catalog-navigation--hidden');
    setTimeout(() => {
      navigationElement.classList.add('catalog-navigation--open');
      laptopWidthMediaQueryList.addEventListener('change', onLaptopWidthMediaQueryListChange);
    }, 0);
  }
  ;
  function close() {
    navigationElement.classList.remove('catalog-navigation--open');
    unlockingPageTimer = setTimeout(() => {
      navigationElement.classList.add('catalog-navigation--hidden');
      unlockPageScroll();
    }, MEDIUM_INTERACTION_DURATION);
    laptopWidthMediaQueryList.removeEventListener('change', onLaptopWidthMediaQueryListChange);
  }
  ;
  openerElement.addEventListener('click', evt => {
    evt.preventDefault();
    open();
  });
}
/* * * * * * * * * * * * * * * * * * * * * * * */

/* * * * * * * * * * * * * * * * * * * * * * * *
 * checker-cards-list.js
 */
function initCheckerCardsList(listElement) {
  const itemElements = Array.from(listElement.querySelectorAll('.checker-cards__item'));
  const setItemElementMinHeightValue = () => {
    listElement.style.setProperty('--item-min-height', 0);
    setTimeout(() => {
      const itemElementsHeightValues = itemElements.map(itemElement => itemElement.offsetHeight);
      const highestHeightValue = `${Math.max(...itemElementsHeightValues)}px`;
      listElement.style.setProperty('--item-min-height', highestHeightValue);
    }, 0);
  };
  setItemElementMinHeightValue();
  window.addEventListener('resize', debounce(setItemElementMinHeightValue));
}
;
/* * * * * * * * * * * * * * * * * * * * * * * */

/* * * * * * * * * * * * * * * * * * * * * * * *
 * document-modal.js
 */
function initDocumentModal(modalElement) {
  const documentElement = modalElement.querySelector('.document');
  initDocument(documentElement);
  new Modal(modalElement);
}
/* * * * * * * * * * * * * * * * * * * * * * * */

/* * * * * * * * * * * * * * * * * * * * * * * *
 * document.js
 */
function initDocument(documentElement) {
  const contentElement = documentElement.querySelector('.document__content');
  new SimpleBar(contentElement, {
    autoHide: false
  });
}
/* * * * * * * * * * * * * * * * * * * * * * * */

/* * * * * * * * * * * * * * * * * * * * * * * *
 * dropdown.js
 */
function initDropdown(dropdownElement) {
  const listItemsElement = dropdownElement.querySelector('.dropdown__list-items');
  const laptopWidthMediaQueryList = window.matchMedia(LAPTOP_WIDTH_MEDIA_QUERY);
  let unlockingPageTimer = null;
  new SimpleBar(listItemsElement, {
    autoHide: false
  });
  dropdownElement.addEventListener('click', evt => {
    if (evt.target.closest('.dropdown__toggle-button')) {
      if (dropdownElement.classList.contains('dropdown--open')) {
        close();
      } else {
        open();
      }
    } else {
      const listItemElement = evt.target.closest('.dropdown__list-item');
      if (listItemElement) {
        const selectedElement = listItemElement.querySelector('.dropdown__option-label, .dropdown__link');
        dropdownElement.querySelector('.dropdown__toggle-button-text').textContent = selectedElement.textContent;
        if (selectedElement.classList.contains('dropdown__link')) {
          dropdownElement.querySelector('.dropdown__link--active')?.classList.remove('dropdown__link--active');
          selectedElement.classList.add('dropdown__link--active');
        }
        close();
      } else if (evt.target.closest('.dropdown__close-button')) {
        close();
      }
    }
  });
  function onDocumentClick(evt) {
    const targetElement = evt.target.closest('.dropdown');
    if (targetElement !== dropdownElement || evt.target.matches('.dropdown__list-wrapper')) {
      evt.preventDefault();
      close();
    }
  }
  function open() {
    if (!laptopWidthMediaQueryList.matches && !Modal.openModalsCount) {
      lockPageScroll();
    }
    clearTimeout(unlockingPageTimer);
    dropdownElement.classList.add('dropdown--open');
    setTimeout(() => {
      document.addEventListener('click', onDocumentClick);
    }, 0);
  }
  ;
  function close() {
    dropdownElement.classList.remove('dropdown--open');
    document.removeEventListener('click', onDocumentClick);
    if (Modal.openModalsCount) {
      return;
    }
    unlockingPageTimer = setTimeout(() => {
      unlockPageScroll();
    }, MEDIUM_INTERACTION_DURATION);
  }
  ;
}
/* * * * * * * * * * * * * * * * * * * * * * * */

/* * * * * * * * * * * * * * * * * * * * * * * *
 * folds.js
 */
const initFolds = foldsElement => {
  foldsElement.addEventListener('click', _ref3 => {
    let {
      target
    } = _ref3;
    const buttonElement = target.closest('.folds__button');
    if (!buttonElement) {
      return;
    }
    const foldElement = buttonElement.closest('.folds__item');
    const contentWrapperElement = foldElement.querySelector('.folds__item-content-wrapper');
    const contentElement = contentWrapperElement.querySelector('.folds__item-content');
    const contentElementHeight = contentElement.getBoundingClientRect().height;
    contentWrapperElement.style.height = `${contentElementHeight}px`;
    contentElement.style.position = 'absolute';
    setTimeout(() => {
      foldElement.classList.toggle('folds__item--open');
    }, 20);
    buttonElement.ariaExpanded = buttonElement.ariaExpanded === 'true' ? 'false' : 'true';
  });
  foldsElement.addEventListener('transitionend', _ref4 => {
    let {
      target
    } = _ref4;
    const foldElement = target.closest('.folds__item');
    if (!foldElement || !foldElement.classList.contains('folds__item--open')) {
      return;
    }
    if (target.classList.contains('folds__item-content')) {
      target.style.position = 'static';
    }
    if (target.classList.contains('folds__item-content-wrapper')) {
      setTimeout(() => {
        target.style.height = 'auto';
      }, 0);
    }
  });
};
/* * * * * * * * * * * * * * * * * * * * * * * */

/* * * * * * * * * * * * * * * * * * * * * * * *
 * contacts-modal-map.js
 */
async function initLocationsModal(modalElement) {
  const headingElement = modalElement.querySelector('.modal-locations__heading');
  const locationsList = modalElement.querySelector('.locations__list');
  const mapElements = locationsList.querySelectorAll('.map');
  const maps = [];
  for (const mapElement of mapElements) {
    const map = await initMap(mapElement);
    maps.push(map);
  }
  new Modal(modalElement, {
    onOpenerClick: evt => {
      maps.forEach(map => map.reset());
      const text = evt.target.closest('.checker-cards__item-label').textContent;
      const locationId = evt.target.dataset.locationId;
      locationsList.dataset.activeItem = locationId;
      headingElement.textContent = text;
    }
  });
}
/* * * * * * * * * * * * * * * * * * * * * * * */

/* * * * * * * * * * * * * * * * * * * * * * * *
 * map.js
 */
async function initMap(mapElement) {
  const latitude = mapElement.dataset.latitude;
  const longitude = mapElement.dataset.longitude;
  const zoom = mapElement.dataset.zoom;
  const center = [longitude, latitude];
  const containerElement = mapElement.querySelector('.map__inner');
  containerElement.style.filter = 'hue-rotate(-180deg) grayscale(0.9)';
  await ymaps3.ready;
  const {
    YMap,
    YMapDefaultSchemeLayer,
    YMapMarker,
    YMapDefaultFeaturesLayer
  } = ymaps3;
  const map = new YMap(containerElement, {
    location: {
      center,
      zoom
    }
  });
  map.addChild(new YMapDefaultSchemeLayer());
  map.addChild(new YMapDefaultFeaturesLayer());
  const markerElement = document.querySelector('#map-marker-template').content.querySelector('.map-marker').cloneNode(true);
  const marker = new YMapMarker({
    coordinates: center
  }, markerElement);
  const timerId = setInterval(() => {
    const canvasElement = mapElement.querySelector('canvas');
    if (canvasElement) {
      clearInterval(timerId);
      canvasElement.style.filter = 'hue-rotate(-180deg) grayscale(0.9)';
      containerElement.style.filter = '';
      map.addChild(marker);
    }
  }, 1000);
  map.reset = () => {
    map.setLocation({
      center,
      zoom
    });
  };
  return map;
}
/* * * * * * * * * * * * * * * * * * * * * * * */

/* * * * * * * * * * * * * * * * * * * * * * * *
 * menu.js
 */
function initMenu(menuElement) {
  const menuContentElement = menuElement.querySelector('.menu__content');
  const openerElement = document.querySelector('.site-header__burger');
  new SimpleBar(menuContentElement, {
    autoHide: false
  });
  const customScrollBarContentWrapper = menuElement.querySelector('.simplebar-content-wrapper');
  openerElement.addEventListener('click', evt => {
    evt.preventDefault();
    lockPageScroll();
    customScrollBarContentWrapper.scrollTop = 0;
    menuElement.showModal();
  });
  menuElement.addEventListener('click', evt => {
    if (evt.target === menuElement || evt.target.closest('.menu__button--close')) {
      evt.preventDefault();
      menuElement.close();
      setTimeout(() => {
        unlockPageScroll();
      }, MEDIUM_INTERACTION_DURATION);
    }
  });
  const headingsWrapperElement = menuElement.querySelector('.menu__headings');
  const headingElements = headingsWrapperElement.querySelectorAll('.menu__heading[data-name]');
  const navigationElement = menuElement.querySelector('.menu__catalog-navigation');
  const sectionElements = navigationElement.querySelectorAll('.menu__catalog-navigation-section');

  // Смена "вкладок" Марки / Категории
  headingsWrapperElement.addEventListener('click', evt => {
    const sectionName = evt.target.dataset.name;
    if (!sectionName) {
      return;
    }
    for (let i = 0; i < sectionElements.length; i++) {
      headingElements[i].classList.toggle('menu__heading--active', headingElements[i].dataset.name === sectionName);
      sectionElements[i].classList.toggle('menu__catalog-navigation-section--active', sectionElements[i].dataset.name === sectionName);
    }
    customScrollBarContentWrapper.scrollTop = 0;
  });

  // Навигация по спискам
  const breadcrumbs = [];
  const groupTitleEement = menuElement.querySelector('.menu__heading--group');
  const backButtonElement = menuElement.querySelector('.menu__button--back');
  navigationElement.addEventListener('click', evt => {
    const buttonElement = evt.target.closest('.menu__catalog-navigation-button');
    if (!buttonElement) {
      return;
    }
    groupTitleEement.textContent = buttonElement.textContent;
    const currentNavigationListItemElement = buttonElement.parentElement;
    const parentListLevel = currentNavigationListItemElement.parentElement.dataset.level;
    menuElement.dataset.level = +parentListLevel + 1;
    currentNavigationListItemElement.classList.add('menu__catalog-navigation-item--active');
    breadcrumbs.push(currentNavigationListItemElement);
  });
  backButtonElement.addEventListener('click', evt => {
    evt.preventDefault();
    menuElement.dataset.level = Math.max(0, +menuElement.dataset.level - 1);
    breadcrumbs.pop()?.classList.remove('menu__catalog-navigation-item--active');
    groupTitleEement.textContent = breadcrumbs.at(-1)?.querySelector('.menu__catalog-navigation-button').textContent;
  });
}
/* * * * * * * * * * * * * * * * * * * * * * * */

/* * * * * * * * * * * * * * * * * * * * * * * *
 * phone-field.js
 */
function initPhoneField(fieldElement) {
  function getInputNumbersValue(input) {
    return input.value.replace(/\D/g, '');
  }
  function onFieldInput(evt) {
    const input = evt.target;
    let fieldNumbersValue = getInputNumbersValue(input);
    let formattedInputValue = '';
    const selectionStart = input.selectionStart;
    if (!fieldNumbersValue) {
      input.value = '';
      return;
    }
    if (input.value.length !== selectionStart) {
      if (evt.data && /\D/g.test(evt.data)) {
        input.value = fieldNumbersValue;
      }
      return;
    }
    if (!['7', '8', '9'].includes(fieldNumbersValue[0])) {
      input.value = `+${fieldNumbersValue}`.substring(0, 16);
      return;
    }
    if (fieldNumbersValue[0] === '9') {
      fieldNumbersValue = `7${fieldNumbersValue}`;
    }
    const firstSymbol = fieldNumbersValue[0] === '8' ? '8' : '+7';
    formattedInputValue = `${firstSymbol} `;
    if (fieldNumbersValue.length > 1) {
      formattedInputValue += `(${fieldNumbersValue.substring(1, 4)}`;
    }
    if (fieldNumbersValue.length >= 5) {
      formattedInputValue += `) ${fieldNumbersValue.substring(4, 7)}`;
    }
    if (fieldNumbersValue.length >= 8) {
      formattedInputValue += `-${fieldNumbersValue.substring(7, 9)}`;
    }
    if (fieldNumbersValue.length >= 10) {
      formattedInputValue += `-${fieldNumbersValue.substring(9, 11)}`;
    }
    input.value = formattedInputValue;
  }
  function onFieldKeydown(evt) {
    const input = evt.target;
    if (evt.code === 'Backspace' && getInputNumbersValue(input).length === 1) {
      input.value = '';
      input.dispatchEvent(inputEvent);
      input.dispatchEvent(changeEvent);
    }
  }
  function onFieldPaste(evt) {
    const pasted = evt.clipboardData || window.clipboardData;
    const input = evt.target;
    const fieldNumbersValue = getInputNumbersValue(input);
    if (pasted) {
      const pastedText = pasted.getData('Text');
      if (/\D/g.test(pastedText)) {
        input.value = fieldNumbersValue;
      }
    }
  }
  fieldElement.addEventListener('input', onFieldInput);
  fieldElement.addEventListener('keydown', onFieldKeydown);
  fieldElement.addEventListener('paste', onFieldPaste);
}
/* * * * * * * * * * * * * * * * * * * * * * * */

/* * * * * * * * * * * * * * * * * * * * * * * *
 * photo-slider.js
 */
function initPhotoSlider(sliderElement) {
  const mainSliderElement = sliderElement.querySelector('.photo-slider__main-slider');
  const thumbnailsSliderElement = sliderElement.querySelector('.photo-slider__thumbnails-slider');
  const thumbnailsSwiper = new Swiper(thumbnailsSliderElement, {
    watchSlidesProgress: true,
    slidesPerView: 3,
    spaceBetween: 8,
    spaceBetween: 10,
    breakpoints: {
      768: {
        slidesPerView: 6,
        spaceBetween: 8
      },
      1366: {
        slidesPerView: 6,
        spaceBetween: 12
      },
      1920: {
        slidesPerView: 6,
        spaceBetween: 20
      }
    }
  });
  new Swiper(mainSliderElement, {
    effect: 'fade',
    fadeEffect: {
      crossFade: true
    },
    pagination: {
      el: '.photo-slider__main-slider-pagination',
      bulletClass: 'photo-slider__pagination-button',
      bulletActiveClass: 'photo-slider__pagination-button--current',
      renderBullet: getPaginationButtonCreator(),
      clickable: true
    },
    thumbs: {
      swiper: thumbnailsSwiper,
      slideThumbActiveClass: 'photo-slider__thumbnails-slider-item--active'
    }
  });
}
/* * * * * * * * * * * * * * * * * * * * * * * */

/* * * * * * * * * * * * * * * * * * * * * * * *
 * process-slider.js
 */
function initProcessSlider(sliderWrapperElement) {
  const sliderElement = sliderWrapperElement.querySelector('.process-slider');
  const prevButtonElement = sliderWrapperElement.querySelector('.slider-arrows__button--prev');
  const nextButtonElement = sliderWrapperElement.querySelector('.slider-arrows__button--next');
  new Swiper(sliderElement, {
    slidesPerView: 2,
    spaceBetween: 15,
    navigation: {
      prevEl: prevButtonElement,
      nextEl: nextButtonElement,
      disabledClass: 'slider-arrows__button--disabled'
    },
    breakpoints: {
      768: {
        spaceBetween: 20
      },
      1366: {
        spaceBetween: 30
      },
      1920: {
        spaceBetween: 40
      }
    }
  });
}
/* * * * * * * * * * * * * * * * * * * * * * * */

/* * * * * * * * * * * * * * * * * * * * * * * *
 * product-buttons.js
 */
function initProductButtons(buttonsElement) {
  const toggleFormFooterStickiness = () => {
    if (laptopWidthMediaQueryList.matches) {
      return;
    }
    const documentHeight = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight, document.body.offsetHeight, document.documentElement.offsetHeight, document.body.clientHeight, document.documentElement.clientHeight);
    const windowHeight = document.documentElement.clientHeight;
    const scrollPosition = window.scrollY;
    const isAtBottom = windowHeight + scrollPosition >= documentHeight;
    buttonsElement.classList.toggle('product__buttons--sticked', !isAtBottom);
  };
  const setPageBottomIndent = () => {
    if (!laptopWidthMediaQueryList.matches) {
      const bottomValue = parseFloat(getComputedStyle(buttonsElement).bottom);
      document.body.style.paddingBottom = `${buttonsElement.offsetHeight + bottomValue}px`;
    } else {
      document.body.style.paddingBottom = 0;
    }
  };
  const onWindowResize = debounce(setPageBottomIndent, 500);
  const onWindowScroll = throttle(toggleFormFooterStickiness, 100);
  toggleFormFooterStickiness();
  setPageBottomIndent();
  window.addEventListener('scroll', onWindowScroll);
  window.addEventListener('resize', onWindowResize);
}
/* * * * * * * * * * * * * * * * * * * * * * * */

/* * * * * * * * * * * * * * * * * * * * * * * *
 * product-navigation.js
 */
function initProductNavigation(navigationElement) {
  const siteHeaderElement = document.querySelector('.page__site-header');
  navigationElement.addEventListener('click', evt => {
    evt.preventDefault();
    const id = evt.target.getAttribute('href');
    const targetElement = document.querySelector(id);
    if (targetElement) {
      const targetElementPosition = targetElement.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: targetElementPosition - siteHeaderElement.offsetHeight - 20,
        behavior: 'smooth'
      });
      if (targetElement.matches('.folds__item:not(.folds__item--open)')) {
        targetElement.querySelector('.folds__button').click();
      }
    }
  });
}
/* * * * * * * * * * * * * * * * * * * * * * * */

/* * * * * * * * * * * * * * * * * * * * * * * *
 * products-counters.js
 */
function initProductsCounters(productsWrapperElement) {
  productsWrapperElement.addEventListener('click', evt => {
    const counterButtonElement = evt.target.closest('.counter__button');
    if (!counterButtonElement) {
      return;
    }
    const counterControlElement = counterButtonElement.closest('.counter').querySelector('.counter__control');
    switch (true) {
      case counterButtonElement.matches('.counter__button--minus'):
        counterControlElement.stepDown();
        break;
      case counterButtonElement.matches('.counter__button--plus'):
        counterControlElement.stepUp();
        break;
    }
    counterControlElement.dispatchEvent(inputEvent);
    counterControlElement.dispatchEvent(changeEvent);
  });
}
/* * * * * * * * * * * * * * * * * * * * * * * */

/* * * * * * * * * * * * * * * * * * * * * * * *
 * products-slider.js
 */
function initProductsSlider(sliderWrapperElement) {
  const sliderElement = sliderWrapperElement.querySelector('.products-slider');
  const prevButtonElement = sliderWrapperElement.querySelector('.slider-arrows__button--prev');
  const nextButtonElement = sliderWrapperElement.querySelector('.slider-arrows__button--next');
  new Swiper(sliderElement, {
    spaceBetween: 15,
    navigation: {
      prevEl: prevButtonElement,
      nextEl: nextButtonElement,
      disabledClass: 'slider-arrows__button--disabled'
    },
    watchSlidesProgress: true,
    breakpoints: {
      375: {
        slidesPerView: 2,
        spaceBetween: 15
      },
      768: {
        slidesPerView: 3,
        spaceBetween: 15
      },
      1280: {
        slidesPerView: 4,
        spaceBetween: 20
      },
      1366: {
        slidesPerView: 4,
        spaceBetween: 30
      },
      1920: {
        slidesPerView: 4,
        spaceBetween: 40
      }
    }
  });
}
/* * * * * * * * * * * * * * * * * * * * * * * */

/* * * * * * * * * * * * * * * * * * * * * * * *
 * reviews.js
 */
function createReviewsListItemString(review) {
  const formattedDate = new Date(review.date).toLocaleDateString('ru-RU');
  return `
    <li class="reviews-list__item">
      <article class="review">
        <p class="review__rating">
          <span class="visually-hidden">Рейтинг: ${review.rating}</span>
          <span class="stars-icon stars-icon--size_m" data-value="${review.rating}"></span>
        </p>
        <div class="review__content">
          <p>${review.text}</p>
        </div>
        <footer class="review__footer">
          <p class="review__author">${review.author}</p>
          <time class="review__date" datetime="${review.data}">${formattedDate}</time>
        </footer>
      </article>
    </li>
  `;
}
/* * * * * * * * * * * * * * * * * * * * * * * */

function showAlert(_ref5) {
  let {
    heading,
    status,
    mode,
    text,
    buttonText
  } = _ref5;
  const alert = new Alert({
    heading,
    status,
    mode,
    text,
    buttonText
  });
  alert.open();
  return alert;
}

/* * * * * * * * * * * * * * * * * * * * * * * *
 * simple-form.js
 */
function initSimpleForm(formElement) {
  const fieldElement = formElement.querySelector('.simple-form__control');
  const clearButtonElement = formElement.querySelector('.simple-form__button--clear');
  const updateEmptyStatus = () => {
    formElement.classList.toggle('simple-form--empty', !fieldElement.value);
  };
  updateEmptyStatus();
  formElement.addEventListener('input', () => {
    updateEmptyStatus();
  });
  clearButtonElement.addEventListener('click', () => {
    fieldElement.value = '';
    updateEmptyStatus();
    fieldElement.focus();
  });
}
/* * * * * * * * * * * * * * * * * * * * * * * */

/* * * * * * * * * * * * * * * * * * * * * * * *
 * site-header.js
 */
function initSiteHeader(headerElement) {
  // Открытие/закрытие меню пользователя, когда он авторизован.

  const userLinkElement = headerElement.querySelector('.shortcuts__link--user');
  const userMenuElement = headerElement.querySelector('.shortcuts__item--user .shortcuts__menu');
  let unlockingPageTimer = null;
  function onDocumentClick(evt) {
    console.log(evt.target);
    if (evt.target.closest('.shortcuts__menu-close-button') || evt.target.closest('.shortcuts__menu-link') || evt.target.matches('.shortcuts__menu')) {
      closeUserMenu();
    }
  }
  function onLaptopWidthMediaQueryListChange() {
    closeUserMenu();
  }
  function openUserMenu() {
    lockPageScroll();
    clearTimeout(unlockingPageTimer);
    userMenuElement.classList.add('shortcuts__menu--open');
    setTimeout(() => {
      document.addEventListener('click', onDocumentClick);
      laptopWidthMediaQueryList.addEventListener('change', onLaptopWidthMediaQueryListChange);
    }, 0);
  }
  function closeUserMenu() {
    userMenuElement.classList.remove('shortcuts__menu--open');
    unlockingPageTimer = setTimeout(() => {
      unlockPageScroll();
    }, MEDIUM_INTERACTION_DURATION);
    document.removeEventListener('click', onDocumentClick);
    laptopWidthMediaQueryList.removeEventListener('change', onLaptopWidthMediaQueryListChange);
  }
  ;
  userLinkElement.addEventListener('click', evt => {
    if (userLinkElement.matches('[data-modal-opener]') || laptopWidthMediaQueryList.matches) {
      return;
    }
    evt.preventDefault();
    openUserMenu();
  });

  // Скрытие/отобржение шапки при прокрутке.

  let pageScrollY = 0;
  const onWindowScroll = () => {
    const headerHeight = headerElement.offsetHeight;
    if (window.scrollY > 0) {
      headerElement.classList.add('site-header--sticked');
    }
    if (window.scrollY > pageScrollY && window.scrollY > headerHeight) {
      headerElement.classList.add('site-header--hidden');
    } else {
      headerElement.classList.remove('site-header--hidden');
      if (window.scrollY === 0) {
        headerElement.classList.remove('site-header--sticked');
      }
    }
    pageScrollY = window.scrollY;
  };
  window.addEventListener('scroll', onWindowScroll);
  onWindowScroll();

  // Отображение формы поиска на мобильной ширине
  const searchFormInnerWrapperElement = headerElement.querySelector('.site-header__search-form');
  const searchFormOuterWrapperElement = headerElement.querySelector('.site-header__search-form-outer-wrapper');
  const searchFormElement = searchFormInnerWrapperElement.querySelector('.site-header__search-form form');
  const searchFormToggleButtonElement = document.querySelector('.site-header__user-navigation-link--search');
  function moveSearchForm() {
    if (desktopWidthMediaQueryList.matches) {
      searchFormInnerWrapperElement.append(searchFormElement);
    } else {
      searchFormOuterWrapperElement.append(searchFormElement);
    }
  }
  desktopWidthMediaQueryList.addEventListener('change', moveSearchForm);
  moveSearchForm();
  searchFormToggleButtonElement.addEventListener('click', evt => {
    evt.preventDefault();
    headerElement.classList.toggle('site-header--show-outer-search-form');
  });
}
/* * * * * * * * * * * * * * * * * * * * * * * */

/* * * * * * * * * * * * * * * * * * * * * * * *
 * text-area.js
 */
function initTextArea(fieldElement) {
  const controlElement = fieldElement.querySelector('.text-area__control');
  const updateEmptyStatus = () => {
    fieldElement.classList.toggle('text-area--empty', !controlElement.value);
  };
  updateEmptyStatus();
  controlElement.addEventListener('input', () => {
    updateEmptyStatus();
  });
}
/* * * * * * * * * * * * * * * * * * * * * * * */

/* * * * * * * * * * * * * * * * * * * * * * * *
 * text-field.js
 */
function initTextField(fieldElement) {
  const controlElement = fieldElement.querySelector('.text-field__control');
  const clearButtonElement = fieldElement.querySelector('.text-field__button--clear');
  const updateEmptyStatus = () => {
    setTimeout(() => {
      fieldElement.classList.toggle('text-field--empty', !controlElement.value);
    });
  };
  updateEmptyStatus();
  controlElement.addEventListener('input', () => {
    updateEmptyStatus();
  });
  clearButtonElement.addEventListener('click', () => {
    controlElement.value = '';
    updateEmptyStatus();
    controlElement.focus();
    controlElement.dispatchEvent(inputEvent);
    controlElement.dispatchEvent(changeEvent);
  });
}
/* * * * * * * * * * * * * * * * * * * * * * * */

/* * * * * * * * * * * * * * * * * * * * * * * *
 * main.js
 */
const laptopWidthMediaQueryList = window.matchMedia(LAPTOP_WIDTH_MEDIA_QUERY);
const desktopWidthMediaQueryList = window.matchMedia(DESKTOP_WIDTH_MEDIA_QUERY);
const inputEvent = new Event('input', {
  bubbles: true
});
const changeEvent = new Event('change', {
  bubbles: true
});
initSiteHeader(document.querySelector('.site-header'));
document.querySelectorAll('.dropdown').forEach(initDropdown);
let cart = null;
const cartElement = document.querySelector('.cart');
if (cartElement) {
  cart = new Cart(cartElement);
}
document.querySelectorAll('.banner-slider').forEach(initBannerSlider);
document.querySelectorAll('.folds').forEach(initFolds);
document.querySelectorAll('.simple-form').forEach(initSimpleForm);
document.querySelectorAll('.products').forEach(initProductsSlider);
document.querySelectorAll('.process').forEach(initProcessSlider);
document.querySelectorAll('.photo-slider').forEach(initPhotoSlider);
document.querySelectorAll('.checker-cards__list').forEach(initCheckerCardsList);
document.querySelectorAll('.text-field:not(.cart-form [data-delivery-section] .text-field)').forEach(initTextField);
document.querySelectorAll('.text-area').forEach(initTextArea);
document.querySelectorAll('.catalog-navigation').forEach(initCatalogNavigation);
document.querySelectorAll('.menu').forEach(initMenu);
document.querySelectorAll('input[type="tel"]').forEach(initPhoneField);
document.querySelectorAll('.map:not(.modal .map)').forEach(initMap);
document.querySelectorAll('[data-modal="locations"]').forEach(modalElement => {
  initLocationsModal(modalElement);
});
document.querySelectorAll('.modal--with_document').forEach(initDocumentModal);
document.querySelectorAll('.product .page-navigation').forEach(initProductNavigation);
document.querySelectorAll('.product__buttons').forEach(initProductButtons);
document.querySelectorAll('.product, .products-list, .products-slider__list, .cart-form__products-list').forEach(initProductsCounters);
let requestForm = null;
const requestFormElement = document.querySelector('.request-form');
if (requestFormElement) {
  requestForm = new Form(requestFormElement);
}
let callbackModalForm = null;
let callbackModalFormElement = document.querySelector('[data-modal="callback-form"]');
if (callbackModalFormElement) {
  callbackModalForm = new ModalForm(callbackModalFormElement);
}
let buyModalForm = null;
let buyModalFormElement = document.querySelector('[data-modal="buy-form"]');
if (buyModalFormElement) {
  buyModalForm = new ModalForm(buyModalFormElement);
}
let reviewModalForm = null;
let reviewModalFormElement = document.querySelector('[data-modal="review-form"]');
if (reviewModalFormElement) {
  reviewModalForm = new ModalForm(reviewModalFormElement);
}
let subscriptionForm = null;
let subscriptionFormElement = document.querySelector('.site-footer__subscription .simple-form');
if (subscriptionFormElement) {
  subscriptionForm = new Form(subscriptionFormElement);
}
let modalEntry = null;
const modalEntryElement = document.querySelector('[data-modal="entry"]');
if (modalEntryElement) {
  modalEntry = new ModalEntry(modalEntryElement);
}

/* * * * * * * * * * * * * * * * * * * * * * * */