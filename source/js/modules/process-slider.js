/* * * * * * * * * * * * * * * * * * * * * * * *
 * process-slider.js
 */
function initProcessSlider(sliderWrapperElement) {
  console.log('sdf')
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
        spaceBetween: 20,
      },
      1366: {
        spaceBetween: 30,
      },
      1920: {
        spaceBetween: 40,
      },
    }
  });
}
/* * * * * * * * * * * * * * * * * * * * * * * */
