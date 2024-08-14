/* * * * * * * * * * * * * * * * * * * * * * * *
 * products-counters.js
 */
function initProductsCounters(productsWrapperElement) {
  productsWrapperElement.addEventListener('click', (evt) => {
    const counterButtonElement = evt.target.closest('.counter__button');

    if (!counterButtonElement) {
      return;
    }

    const counterControlElement = counterButtonElement
      .closest('.counter')
      .querySelector('.counter__control');

    switch (true) {
      case counterButtonElement.matches('.counter__button--minus'):
        counterControlElement.stepDown();
        break;
      case counterButtonElement.matches('.counter__button--plus'):
        counterControlElement.stepUp();
        break;
    }

    counterControlElement.dispatchEvent(inputEvent);
    counterControlElement.dispatchEvent(changeEvent);
  });
}
/* * * * * * * * * * * * * * * * * * * * * * * */
