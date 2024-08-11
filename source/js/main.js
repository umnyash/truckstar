/* * * * * * * * * * * * * * * * * * * * * * * *
 * main.js
 */
const laptopWidthMediaQueryList = window.matchMedia(LAPTOP_WIDTH_MEDIA_QUERY);
const desktopWidthMediaQueryList = window.matchMedia(DESKTOP_WIDTH_MEDIA_QUERY);
const inputEvent = new Event('input', { bubbles: true });
const changeEvent = new Event('change', { bubbles: true });

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
document.querySelectorAll('[data-modal="locations"]').forEach((modalElement) => {
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
