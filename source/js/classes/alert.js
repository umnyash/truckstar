/* * * * * * * * * * * * * * * * * * * * * * * *
 * alert.js
 */
class Alert extends Modal {
  constructor({ heading, status = 'success', mode, text }) {
    const modalElement = Alert.createElement({ heading, status, mode, text });
    document.body.append(modalElement);
    super(modalElement);
    this.button = modalElement.querySelector('.alert__button');
  }

  static createElement({ heading, status, mode, text }) {
    const modalString = `
      <dialog class="modal modal--position_center modal--with_alert">
        <div class="modal__inner">
          <button class="modal__button modal__button--close" type="button" data-modal-close-button>
            <span class="visually-hidden">Закрыть</span>
          </button>
          <section class="alert modal__alert ${(status === 'error') ? 'alert--error' : ''} ${(mode === 'alter') ? 'alert--alter' : ''}">
            <h2 class="alert__heading heading">${heading}</h2>
            ${text ? `<p class="alert__text">${text}</p>` : ''}
            <button class="alert__button button button--secondary button--right button--size_l" type="button" ${status === 'success' && 'data-modal-close-button'}>
              <span class="button__inner">${status === 'error' ? 'Повторить' : 'Закрыть'}<span class="button__icon"></span></span>
            </button>
          </section>
        </div>
      </dialog>
    `;

    return createElementByString(modalString);
  }
}
/* * * * * * * * * * * * * * * * * * * * * * * */
