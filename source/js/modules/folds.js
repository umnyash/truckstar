/* * * * * * * * * * * * * * * * * * * * * * * *
 * folds.js
 */
function initFolds(foldsElement) {
  foldsElement.addEventListener('click', ({ target }) => {
    const buttonElement = target.closest('.folds__button');
    if (!buttonElement) {
      return;
    }

    const foldElement = buttonElement.closest('.folds__item');
    const contentWrapperElement = foldElement.querySelector('.folds__item-content-wrapper');
    const contentElement = contentWrapperElement.querySelector('.folds__item-content');

    const contentElementHeight = contentElement.getBoundingClientRect().height;
    contentWrapperElement.style.height = `${contentElementHeight}px`;

    contentElement.style.position = 'absolute';

    setTimeout(() => {
      foldElement.classList.toggle('folds__item--open');
    }, 20);

    buttonElement.ariaExpanded = buttonElement.ariaExpanded === 'true' ? 'false' : 'true';
  });

  foldsElement.addEventListener('transitionend', ({ target }) => {
    const foldElement = target.closest('.folds__item');

    if (!foldElement || !foldElement.classList.contains('folds__item--open')) {
      return;
    }

    if (target.classList.contains('folds__item-content')) {
      target.style.position = 'static';
    }

    if (target.classList.contains('folds__item-content-wrapper')) {
      setTimeout(() => {
        target.style.height = 'auto';
      }, 0);
    }
  });
};
/* * * * * * * * * * * * * * * * * * * * * * * */
