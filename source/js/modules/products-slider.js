/* * * * * * * * * * * * * * * * * * * * * * * *
 * products-slider.js
 */
function initProductsSlider(sliderWrapperElement) {
  // new Swiper(sliderElement, {
  //   effect: 'fade',
  //   fadeEffect: {
  //     crossFade: true
  //   },
  //   loop: true,
  //   speed: 1400,
  //   allowTouchMove: false,
  //   autoplay: {
  //     delay: 1000,
  //     disableOnInteraction: false
  //   }
  // });
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
      },
      1366: {
        slidesPerView: 4,
        spaceBetween: 30,
      },
      1920: {
        spaceBetween: 40,
      },
    }
  });
}
/* * * * * * * * * * * * * * * * * * * * * * * */
