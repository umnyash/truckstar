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
        spaceBetween: 15,
      },
      1280: {
        slidesPerView: 4,
        spaceBetween: 20,
      },
      1366: {
        slidesPerView: 4,
        spaceBetween: 30,
      },
      1920: {
        slidesPerView: 4,
        spaceBetween: 40,
      },
    }
  });
}
/* * * * * * * * * * * * * * * * * * * * * * * */
