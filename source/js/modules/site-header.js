/* * * * * * * * * * * * * * * * * * * * * * * *
 * site-header.js
 */
function initSiteHeader(headerElement) {
  // Открытие/закрытие меню пользователя, когда он авторизован.

  const userLinkElement = headerElement.querySelector('.shortcuts__link--user');
  const userMenuElement = headerElement.querySelector('.shortcuts__item--user .shortcuts__menu');

  let unlockingPageTimer = null;

  function onDocumentClick(evt) {
    console.log(evt.target)
    if (
      evt.target.closest('.shortcuts__menu-close-button') ||
      evt.target.closest('.shortcuts__menu-link') ||
      evt.target.matches('.shortcuts__menu')
    ) {
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
    }, 0)
  }

  function closeUserMenu() {
    userMenuElement.classList.remove('shortcuts__menu--open');

    unlockingPageTimer = setTimeout(() => {
      unlockPageScroll();
    }, MEDIUM_INTERACTION_DURATION);

    document.removeEventListener('click', onDocumentClick);
    laptopWidthMediaQueryList.removeEventListener('change', onLaptopWidthMediaQueryListChange);
  };

  userLinkElement.addEventListener('click', (evt) => {
    if (userLinkElement.matches('[data-modal-opener]') || laptopWidthMediaQueryList.matches) {
      return;
    }

    evt.preventDefault();
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
    if (laptopWidthMediaQueryList.matches) {
      searchFormInnerWrapperElement.append(searchFormElement);
    } else {
      searchFormOuterWrapperElement.append(searchFormElement);
    }
  }

  laptopWidthMediaQueryList.addEventListener('change', moveSearchForm);
  moveSearchForm();

  searchFormToggleButtonElement.addEventListener('click', (evt) => {
    evt.preventDefault();
    headerElement.classList.toggle('site-header--show-outer-search-form');
  });
}
/* * * * * * * * * * * * * * * * * * * * * * * */
