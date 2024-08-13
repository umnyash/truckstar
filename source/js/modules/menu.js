/* * * * * * * * * * * * * * * * * * * * * * * *
 * menu.js
 */
function initMenu(menuElement) {
  const menuContentElement = menuElement.querySelector('.menu__content');
  const openerElement = document.querySelector('.site-header__burger');

  new SimpleBar(menuContentElement, { autoHide: false });
  const customScrollBarContentWrapper = menuElement.querySelector('.simplebar-content-wrapper');

  openerElement.addEventListener('click', (evt) => {
    evt.preventDefault();
    lockPageScroll();

    customScrollBarContentWrapper.scrollTop = 0;
    menuElement.showModal();
  });

  menuElement.addEventListener('click', (evt) => {
    if (evt.target === menuElement || evt.target.closest('.menu__button--close')) {
      evt.preventDefault();
      menuElement.close();

      setTimeout(() => {
        unlockPageScroll();
      }, MEDIUM_INTERACTION_DURATION);
    }
  });

  const headingsWrapperElement = menuElement.querySelector('.menu__headings');
  const headingElements = headingsWrapperElement.querySelectorAll('.menu__heading[data-name]');
  const navigationElement = menuElement.querySelector('.menu__catalog-navigation');
  const sectionElements = navigationElement.querySelectorAll('.menu__catalog-navigation-section');

  // Смена "вкладок" Марки / Категории
  headingsWrapperElement.addEventListener('click', (evt) => {
    const sectionName = evt.target.dataset.name;

    if (!sectionName) {
      return;
    }

    for (let i = 0; i < sectionElements.length; i++) {
      headingElements[i].classList.toggle(
        'menu__heading--active',
        headingElements[i].dataset.name === sectionName
      );

      sectionElements[i].classList.toggle(
        'menu__catalog-navigation-section--active',
        sectionElements[i].dataset.name === sectionName
      );
    }

    customScrollBarContentWrapper.scrollTop = 0;
  });

  // Навигация по спискам
  const breadcrumbs = [];
  const groupTitleEement = menuElement.querySelector('.menu__heading--group');
  const backButtonElement = menuElement.querySelector('.menu__button--back');

  navigationElement.addEventListener('click', (evt) => {
    const buttonElement = evt.target.closest('.menu__catalog-navigation-button');

    if (!buttonElement) {
      return;
    }

    groupTitleEement.textContent = buttonElement.textContent;
    const currentNavigationListItemElement = buttonElement.parentElement;
    const parentListLevel = currentNavigationListItemElement.parentElement.dataset.level;
    menuElement.dataset.level = +parentListLevel + 1;
    currentNavigationListItemElement.classList.add('menu__catalog-navigation-item--active');
    breadcrumbs.push(currentNavigationListItemElement);
  });

  backButtonElement.addEventListener('click', (evt) => {
    evt.preventDefault();
    menuElement.dataset.level = Math.max(0, +menuElement.dataset.level - 1);
    breadcrumbs.pop()?.classList.remove('menu__catalog-navigation-item--active');
    groupTitleEement.textContent = breadcrumbs.at(-1)?.querySelector('.menu__catalog-navigation-button').textContent;
  })

}
/* * * * * * * * * * * * * * * * * * * * * * * */
