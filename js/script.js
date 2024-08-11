"use strict";

const LAPTOP_WIDTH_MEDIA_QUERY = '(min-width: 1280px)';
const DESKTOP_WIDTH_MEDIA_QUERY = '(min-width: 1366px)';
const MEDIUM_INTERACTION_DURATION = 400;
const MODAL_ANIMATION_DURATION = 5000; // Соответствует $modal-animation-duration в variables.scss

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
    this.name = modalElement.dataset.modal;
    this.initOpeners();
    this.closebutton = this.modalElement.querySelector('.modal__close-button');
    this.closebutton.addEventListener('click', () => this.close());
    this.modalElement.addEventListener('close', () => this.onModalClose());
    this.onOpenerClick = onOpenerClick;
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
      status,
      text,
      buttonText
    } = _ref;
    const modalElement = Alert.createElement({
      heading,
      status,
      text,
      buttonText
    });
    document.body.append(modalElement);
    super(modalElement);
    modalElement.querySelector('.alert__button').addEventListener('click', evt => {
      evt.preventDefault();
      this.close();
    });
  }
  static createElement(_ref2) {
    let {
      heading,
      status,
      text,
      buttonText
    } = _ref2;
    const modalString = `
      <dialog class="modal modal--position_center modal--with_alert">
        <div class="modal__inner">
          <button class="modal__close-button" type="button">
            <span class="visually-hidden">Закрыть</span>
          </button>
          <section class="alert modal__alert ${status === 'error' ? 'alert--error' : ''}">
            <h2 class="alert__heading heading">${heading}</h2>
            ${text ? `<p class="alert__text">${text}</p>` : ''}
            <button class="alert__button button--secondary button--right button--size_l" type="button">
              <span class="button__inner">${buttonText || 'Закрыть'}<span class="button__icon"></span></span>
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
    const messageFieldElement = this.formElement.querySelector('[data-name="message"]');
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
class Form {
  constructor(formElement) {
    this.formElement = formElement;
    this.textFieldControlElements = this.formElement.querySelectorAll('.text-field__control');
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
    this.formElement.addEventListener('submit', evt => {
      evt.preventDefault();
      const isValid = this.validator.validate();
      if (isValid) {
        console.log('Форма валидна');
        this.submitButtonElement.disabled = true;
        this.submitButtonElement.classList.add('button--pending');
        sendData(this.actionUrl, new FormData(evt.target), data => {
          this.formElement.reset();
          this.successHandler(data);
        }, data => {
          this.errorHandler(data);
        }, () => {
          this.submitButtonElement.disabled = false;
          this.submitButtonElement.classList.remove('button--pending');
        });
      } else {
        console.log('Форма невалидна');
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
        firstInvalidItemElement.querySelector('input').focus();
        firstInvalidItemElement.classList.remove('shake');
        requestAnimationFrame(() => firstInvalidItemElement.classList.add('shake'));
      }
    });
    this.formElement.addEventListener('reset', () => {
      setTimeout(() => {
        this.textFieldControlElements.forEach(textFieldElement => {
          textFieldElement.dispatchEvent(inputEvent);
        });
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
  onProductsListClick = evt => {
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
  };
  toggleDeliveryData = () => {};
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
    this.productsList.addEventListener('click', this.onProductsListClick);
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
    if (targetElement !== dropdownElement) {
      close();
    }
  }
  function open() {
    if (!laptopWidthMediaQueryList.matches) {
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
    unlockingPageTimer = setTimeout(() => {
      unlockPageScroll();
    }, MEDIUM_INTERACTION_DURATION);
    document.removeEventListener('click', onDocumentClick);
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
  const closeButton = document.querySelector('.menu__button--close');
  openerElement.addEventListener('click', evt => {
    evt.preventDefault();
    lockPageScroll();
    menuElement.showModal();
  });
  closeButton.addEventListener('click', evt => {
    evt.preventDefault();
    menuElement.close();
    setTimeout(() => {
      unlockPageScroll();
    }, MEDIUM_INTERACTION_DURATION);
  });
  new SimpleBar(menuContentElement, {
    autoHide: false
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
 * products-slider.js
 */
function initProductsSlider(sliderWrapperElement) {
  const sliderElement = sliderWrapperElement.querySelector('.products-slider');
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

function showAlert(_ref5) {
  let {
    heading,
    status,
    text,
    buttonText
  } = _ref5;
  const alert = new Alert({
    heading,
    status,
    text,
    buttonText
  });
  alert.open();
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
    if (evt.target.closest('.shortcuts__menu-close-button') || evt.target.closest('.shortcuts__menu-link')) {
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
    if (userLinkElement.classList.contains('shortcuts__link--user_not-authorized') || laptopWidthMediaQueryList.matches) {
      return;
    }
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
document.querySelectorAll('.dropdown').forEach(initDropdown);
document.querySelectorAll('.catalog-navigation').forEach(initCatalogNavigation);
document.querySelectorAll('.menu').forEach(initMenu);
document.querySelectorAll('input[type="tel"]').forEach(initPhoneField);
document.querySelectorAll('.map:not(.modal .map)').forEach(initMap);
document.querySelectorAll('[data-modal="locations"]').forEach(modalElement => {
  initLocationsModal(modalElement);
});
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
/* * * * * * * * * * * * * * * * * * * * * * * */