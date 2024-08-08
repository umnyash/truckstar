/* * * * * * * * * * * * * * * * * * * * * * * *
 * modal.js
 */
class Modal {
  constructor(modalElement) {
    this.modalElement = modalElement;
    this.name = modalElement.dataset.modal;
    this.initOpeners();
    this.closebutton = this.modalElement.querySelector('.modal__close-button');
    this.closebutton.addEventListener('click', () => this.close());
    this.modalElement.addEventListener('close', () => this.onModalClose());

    if (!document.body.contains(this.modalElement)) {
      document.body.append(this.modalElement)
    }
  }

  initOpeners = () => {
    const openerElements = document.querySelectorAll(`[data-modal-opener="${this.name}"]`);

    openerElements.forEach((openerElement) => {
      openerElement.addEventListener('click', (evt) => {
        evt.preventDefault();
        this.open();
      });
    });
  }

  open = () => {
    lockPageScroll();
    requestAnimationFrame(() => {
      this.modalElement.showModal();
    })
  }

  close = () => {
    this.modalElement.close();
  }

  onModalClose = () => {
    setTimeout(() => {
      unlockPageScroll();
      if (this.modalElement.classList.contains('modal--with_alert')) {
        this.modalElement.remove();
        this.modalElement = null;
      }
    }, MODAL_ANIMATION_DURATION);
  }
}
/* * * * * * * * * * * * * * * * * * * * * * * */
