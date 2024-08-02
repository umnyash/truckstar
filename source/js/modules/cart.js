/* * * * * * * * * * * * * * * * * * * * * * * *
 * cart.js
 */
class Cart {
  #cartElement = null;
  #formFooterElement = null;

  #laptopWidthMediaQueryList = window.matchMedia(LAPTOP_WIDTH_MEDIA_QUERY);

  constructor({ cartElement }) {
    this.#cartElement = cartElement;
  }

  #toggleFormFooterStickiness = () => {
    if (this.#laptopWidthMediaQueryList.matches) {
      return;
    }

    const documentHeight = Math.max(
      document.body.scrollHeight, document.documentElement.scrollHeight,
      document.body.offsetHeight, document.documentElement.offsetHeight,
      document.body.clientHeight, document.documentElement.clientHeight
    );

    const windowHeight = document.documentElement.clientHeight;
    const scrollPosition = window.scrollY;

    const isAtBottom = (windowHeight + scrollPosition) >= documentHeight;
    this.#formFooterElement.classList.toggle('cart-form__footer--sticked', !isAtBottom);
  };

  #setPageBottomIndent = () => {
    if (!this.#laptopWidthMediaQueryList.matches) {
      const bottomValue = parseFloat(getComputedStyle(this.#formFooterElement).bottom);
      document.body.style.paddingBottom = `${this.#formFooterElement.offsetHeight + bottomValue}px`;
    } else {
      document.body.style.paddingBottom = 0;
    }
  };

  #onWindowResize = debounce(this.#setPageBottomIndent, 500);
  #onWindowScroll = throttle(this.#toggleFormFooterStickiness, 100);

  init() {
    this.#formFooterElement = this.#cartElement.querySelector('.cart-form__footer');

    if (!this.#formFooterElement) {
      return;
    }

    this.#setPageBottomIndent();
    this.#toggleFormFooterStickiness();

    window.addEventListener('resize', this.#onWindowResize);
    window.addEventListener('scroll', this.#onWindowScroll);
  }
}

function initCart({ cartElement }) {
  const cart = new Cart({ cartElement });
  cart.init();
}
/* * * * * * * * * * * * * * * * * * * * * * * */
