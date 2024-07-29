"use strict";

function getPaginationButtonCreator() {
  let slideName = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'Слайд';
  return (index, className) => `
    <button class='${className}' type='button'>
      <span class='visually-hidden'>${slideName} ${index + 1}.</span>
    </button>
  `;
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
 * folds.js
 */
const initFolds = foldsElement => {
  foldsElement.addEventListener('click', _ref => {
    let {
      target
    } = _ref;
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
  foldsElement.addEventListener('transitionend', _ref2 => {
    let {
      target
    } = _ref2;
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
  console.log('sdf');
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
        slidesPerView: 3
      },
      1366: {
        slidesPerView: 4,
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
 * main.js
 */
document.querySelectorAll('.banner-slider').forEach(initBannerSlider);
document.querySelectorAll('.folds').forEach(initFolds);
document.querySelectorAll('.simple-form').forEach(initSimpleForm);
document.querySelectorAll('.products').forEach(initProductsSlider);
document.querySelectorAll('.process').forEach(initProcessSlider);
document.querySelectorAll('.photo-slider').forEach(initPhotoSlider);
/* * * * * * * * * * * * * * * * * * * * * * * */