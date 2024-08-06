"use strict";

const LAPTOP_WIDTH_MEDIA_QUERY = '(min-width: 1280px)';
const DESKTOP_WIDTH_MEDIA_QUERY = '(min-width: 1366px)';
const MEDIUM_INTERACTION_DURATION = 400;
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
 * cart.js
 */
class Cart {
  #cartElement = null;
  #formFooterElement = null;
  #laptopWidthMediaQueryList = window.matchMedia(LAPTOP_WIDTH_MEDIA_QUERY);
  constructor(_ref) {
    let {
      cartElement
    } = _ref;
    this.#cartElement = cartElement;
  }
  #toggleFormFooterStickiness = () => {
    if (this.#laptopWidthMediaQueryList.matches) {
      return;
    }
    const documentHeight = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight, document.body.offsetHeight, document.documentElement.offsetHeight, document.body.clientHeight, document.documentElement.clientHeight);
    const windowHeight = document.documentElement.clientHeight;
    const scrollPosition = window.scrollY;
    const isAtBottom = windowHeight + scrollPosition >= documentHeight;
    this.#formFooterElement.classList.toggle('cart-form__footer--sticked', !isAtBottom);
  };
  #setPageBottomIndent = () => {
    if (!this.#laptopWidthMediaQueryList.matches) {
      const bottomValue = parseFloat(getComputedStyle(this.#formFooterElement).bottom);
      document.body.style.paddingBottom = `${this.#formFooterElement.offsetHeight + bottomValue}px`;
    } else {
      document.body.style.paddingBottom = 0;
    }
  };
  #onWindowResize = debounce(this.#setPageBottomIndent, 500);
  #onWindowScroll = throttle(this.#toggleFormFooterStickiness, 100);
  init() {
    this.#formFooterElement = this.#cartElement.querySelector('.cart-form__footer');
    if (!this.#formFooterElement) {
      return;
    }
    this.#setPageBottomIndent();
    this.#toggleFormFooterStickiness();
    window.addEventListener('resize', this.#onWindowResize);
    window.addEventListener('scroll', this.#onWindowScroll);
  }
}
function initCart(_ref2) {
  let {
    cartElement
  } = _ref2;
  const cart = new Cart({
    cartElement
  });
  cart.init();
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
    fieldElement.classList.toggle('text-field--empty', !controlElement.value);
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

// initSiteHeader(document.querySelector('.site-header'));
const laptopWidthMediaQueryList = window.matchMedia(LAPTOP_WIDTH_MEDIA_QUERY);
const desktopWidthMediaQueryList = window.matchMedia(DESKTOP_WIDTH_MEDIA_QUERY);
document.querySelectorAll('.site-header').forEach(initSiteHeader);
let cart = null;
const cartElement = document.querySelector('.cart');
if (cartElement) {
  cart = initCart({
    cartElement
  });
}
document.querySelectorAll('.banner-slider').forEach(initBannerSlider);
document.querySelectorAll('.folds').forEach(initFolds);
document.querySelectorAll('.simple-form').forEach(initSimpleForm);
document.querySelectorAll('.products').forEach(initProductsSlider);
document.querySelectorAll('.process').forEach(initProcessSlider);
document.querySelectorAll('.photo-slider').forEach(initPhotoSlider);
document.querySelectorAll('.checker-cards__list').forEach(initCheckerCardsList);
document.querySelectorAll('.text-field').forEach(initTextField);
document.querySelectorAll('.text-area').forEach(initTextArea);
document.querySelectorAll('.dropdown').forEach(initDropdown);
document.querySelectorAll('.catalog-navigation').forEach(initCatalogNavigation);
/* * * * * * * * * * * * * * * * * * * * * * * */