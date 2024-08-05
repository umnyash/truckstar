/* * * * * * * * * * * * * * * * * * * * * * * *
 * catalog-navigation.js
 */
function initCatalogNavigation(navigationElement) {
  const innerElement = navigationElement.querySelector('.catalog-navigation__inner');
  const listWrapperElement = innerElement.querySelector('.catalog-navigation__list');
  const openerElement = document.querySelector('.catalog__navigation-opener');

  const laptopWidthMediaQueryList = window.matchMedia(LAPTOP_WIDTH_MEDIA_QUERY);
  let unlockingPageTimer = null;

  new SimpleBar(listWrapperElement, { autoHide: false });

  innerElement.addEventListener('click', (evt) => {
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
      console.log('Это малеькая ширина')
      lockPageScroll();
    }

    clearTimeout(unlockingPageTimer);
    navigationElement.classList.remove('catalog-navigation--hidden');

    setTimeout(() => {
      navigationElement.classList.add('catalog-navigation--open');
      laptopWidthMediaQueryList.addEventListener('change', onLaptopWidthMediaQueryListChange);
    }, 0)
  };

  function close() {
    navigationElement.classList.remove('catalog-navigation--open');

    unlockingPageTimer = setTimeout(() => {
      navigationElement.classList.add('catalog-navigation--hidden');
      unlockPageScroll();
    }, MEDIUM_INTERACTION_DURATION);

    laptopWidthMediaQueryList.removeEventListener('change', onLaptopWidthMediaQueryListChange);
  };

  openerElement.addEventListener('click', (evt) => {
    evt.preventDefault();
    open();
  });
}
/* * * * * * * * * * * * * * * * * * * * * * * */
