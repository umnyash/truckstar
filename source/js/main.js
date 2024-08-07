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
  cart = initCart({ cartElement });
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
document.querySelectorAll('.menu').forEach(initMenu);
/* * * * * * * * * * * * * * * * * * * * * * * */
