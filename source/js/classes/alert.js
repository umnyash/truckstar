/* * * * * * * * * * * * * * * * * * * * * * * *
 * alert.js
 */
class Alert extends Modal {
  constructor({ heading, status, mode, text, buttonText }) {
    const modalElement = Alert.createElement({ heading, status, mode, text, buttonText });
    document.body.append(modalElement);
    super(modalElement);

    modalElement.querySelector('.alert__button').addEventListener('click', (evt) => {
      evt.preventDefault();
      this.close();
    });
  }

  static createElement({ heading, status, mode, text, buttonText }) {
    const modalString = `
      <dialog class="modal modal--position_center modal--with_alert">
        <div class="modal__inner">
          <button class="modal__close-button" type="button">
            <span class="visually-hidden">Закрыть</span>
          </button>
          <section class="alert modal__alert ${(status === 'error') ? 'alert--error' : ''} ${(mode === 'alter') ? 'alert--alter' : ''}">
            <h2 class="alert__heading heading">${heading}</h2>
            ${text ? `<p class="alert__text">${text}</p>` : ''}
            <button class="alert__button button button--secondary button--right button--size_l" type="button">
              <span class="button__inner">${buttonText || 'Закрыть'}<span class="button__icon"></span></span>
            </button>
          </section>
        </div>
      </dialog>
    `;

    return createElementByString(modalString);
  }
}
/* * * * * * * * * * * * * * * * * * * * * * * */
