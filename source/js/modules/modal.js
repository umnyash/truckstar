/* * * * * * * * * * * * * * * * * * * * * * * *
 * modal.js
 */
const MODAL_CLOSING_ANIMATION_DURATION = 450;

function onModalClose(evt) {
  const modalElement = evt.currentTarget;

  modalElement.removeEventListener('close', onModalClose);
  modalElement.removeEventListener('click', onModalClick);

  setTimeout(() => {
    unlockPageScroll();
  }, MODAL_CLOSING_ANIMATION_DURATION);

  if (modalElement.classList.contains('modal--with_alert')) {
    setTimeout(() => {
      modalElement.remove();
    }, MODAL_CLOSING_ANIMATION_DURATION);
  }
}

function onModalClick(evt) {
  const modalElement = evt.currentTarget;

  if (evt.target.classList.contains('modal__close-button') || evt.target.classList.contains('alert__button')) {
    modalElement.close();
    return;
  }

  if (modalElement.classList.contains('modal--with_photo') && evt.target === modalElement) {
    modalElement.close();
  }
}

function openModal(modalElement) {
  lockPageScroll();
  modalElement.addEventListener('close', onModalClose);
  modalElement.addEventListener('click', onModalClick);
  modalElement.showModal();
}
/* * * * * * * * * * * * * * * * * * * * * * * */
