/* * * * * * * * * * * * * * * * * * * * * * * *
 * dropdown.js
 */
function initDropdown(dropdownElement) {
  const laptopWidthMediaQueryList = window.matchMedia(LAPTOP_WIDTH_MEDIA_QUERY);
  let unlockingPageTimer = null;

  dropdownElement.addEventListener('click', (evt) => {
    console.log('click');


    if (evt.target.closest('.dropdown__toggle-button')) {
      if (dropdownElement.classList.contains('dropdown--open')) {
        close();
      } else {
        open();
      }
    } else {
      const listItemElement = evt.target.closest('.dropdown__list-item');

      if (listItemElement) {
        const selectedElement = listItemElement.querySelector('.dropdown__option-label, .dropdown__link');

        dropdownElement.querySelector('.dropdown__toggle-button-text').textContent = selectedElement.textContent;

        if (selectedElement.classList.contains('dropdown__link')) {
          dropdownElement.querySelector('.dropdown__link--active')?.classList.remove('dropdown__link--active');
          selectedElement.classList.add('dropdown__link--active');
        }

        close();
      } else if (evt.target.closest('.dropdown__close-button')) {
        close();
      }
    }
  });

  function onDocumentClick(evt) {
    const targetElement = evt.target.closest('.dropdown');

    if (targetElement !== dropdownElement) {
      close();
    }
  }

  function open() {
    if (!laptopWidthMediaQueryList.matches) {
      lockPageScroll();
    }

    clearTimeout(unlockingPageTimer);

    dropdownElement.classList.add('dropdown--open');

    setTimeout(() => {
      document.addEventListener('click', onDocumentClick);
    }, 0)
  };

  function close() {
    dropdownElement.classList.remove('dropdown--open');

    unlockingPageTimer = setTimeout(() => {
      unlockPageScroll();
    }, MEDIUM_INTERACTION_DURATION);

    document.removeEventListener('click', onDocumentClick);
  };
}
/* * * * * * * * * * * * * * * * * * * * * * * */
