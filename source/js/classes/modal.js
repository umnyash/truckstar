/* * * * * * * * * * * * * * * * * * * * * * * *
 * modal.js
 */
class Modal {
  static openModalsCount = 0;

  constructor(modalElement, { onOpenerClick } = {}) {
    this.modalElement = modalElement;
    this.name = modalElement?.dataset.modal;
    this.initOpeners();
    this.modalElement.addEventListener('close', () => this.onModalClose());
    this.onOpenerClick = onOpenerClick;

    this.modalElement.querySelectorAll('.modal__button--close, [data-modal-close-button]')
      .forEach((buttonElement) => {
        buttonElement.addEventListener('click', () => this.close());
      })

    if (!document.body.contains(this.modalElement)) {
      document.body.append(this.modalElement)
    }
  }

  initOpeners = () => {
    const openerElements = document.querySelectorAll(`[data-modal-opener="${this.name}"]`);

    openerElements.forEach((openerElement) => {
      openerElement.addEventListener('click', (evt) => {
        evt.preventDefault();

        if (this.onOpenerClick) {
          this.onOpenerClick(evt);
        }

        this.open();
      });
    });
  }

  open = () => {
    lockPageScroll();
    requestAnimationFrame(() => {
      this.modalElement.showModal();
      Modal.openModalsCount++;
    })
  }

  close = () => {
    this.modalElement.close();
  }

  onModalClose = () => {
    Modal.openModalsCount--;
    setTimeout(() => {
      if (!Modal.openModalsCount) {
        unlockPageScroll();
      }

      if (this.modalElement.classList.contains('modal--with_alert')) {
        this.modalElement.remove();
        this.modalElement = null;
      }
    }, MODAL_ANIMATION_DURATION);
  }
}
/* * * * * * * * * * * * * * * * * * * * * * * */
