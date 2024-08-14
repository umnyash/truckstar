/* * * * * * * * * * * * * * * * * * * * * * * *
 * cart.js
 */
class Cart {
  constructor(cartElement) {
    this.siteHeaderElement = document.querySelector('.page__site-header');
    this.cartElement = cartElement;
    this.formElement = this.cartElement.querySelector('.cart__form');
    this.init();
  }

  toggleFormFooterStickiness = () => {
    if (laptopWidthMediaQueryList.matches) {
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
    this.formFooterElement.classList.toggle('cart-form__footer--sticked', !isAtBottom);
  };

  setPageBottomIndent = () => {
    if (!laptopWidthMediaQueryList.matches) {
      const bottomValue = parseFloat(getComputedStyle(this.formFooterElement).bottom);
      document.body.style.paddingBottom = `${this.formFooterElement.offsetHeight + bottomValue}px`;
    } else {
      document.body.style.paddingBottom = 0;
    }
  };

  onWindowResize = debounce(this.setPageBottomIndent, 500);
  onWindowScroll = throttle(this.toggleFormFooterStickiness, 100);

  onReceivingMethodSectionChange = (evt) => {
    if (evt.target.dataset.value === 'delivery') {
      this.receivingMethodSectionElement.insertAdjacentElement('afterend', this.deliverySectionElement);
      this.form.validator.reset();
      this.form.validator.init();
    } else {
      this.deliverySectionElement.remove();
      this.form.validator.reset();
      this.form.validator.init();
    }
  };

  init() {
    if (!this.formElement) {
      return;
    }

    this.formFooterElement = this.formElement.querySelector('.cart-form__footer');
    this.form = new Form(this.formElement);
    this.productsList = this.formElement.querySelector('.cart-form__products-list');
    this.deliverySectionElement = this.formElement.querySelector('[data-delivery-section]');
    this.receivingMethodSectionElement = this.formElement.querySelector('[data-receiving-method-section]');

    this.deliverySectionElement.querySelectorAll('.text-field').forEach(initTextField);
    this.deliverySectionElement.remove();
    this.form.validator.init();

    this.setPageBottomIndent();
    this.toggleFormFooterStickiness();

    window.addEventListener('resize', this.onWindowResize);
    window.addEventListener('scroll', this.onWindowScroll);

    this.receivingMethodSectionElement.addEventListener('change', this.onReceivingMethodSectionChange);
  }
}
/* * * * * * * * * * * * * * * * * * * * * * * */
