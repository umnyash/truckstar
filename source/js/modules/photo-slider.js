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
        spaceBetween: 8,
      },
      1366: {
        slidesPerView: 6,
        spaceBetween: 12,
      },
      1920: {
        slidesPerView: 6,
        spaceBetween: 20,
      },
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
      slideThumbActiveClass: 'photo-slider__thumbnails-slider-item--active',
    },
  });
}
/* * * * * * * * * * * * * * * * * * * * * * * */
