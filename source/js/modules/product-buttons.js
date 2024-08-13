/* * * * * * * * * * * * * * * * * * * * * * * *
 * product-buttons.js
 */
function initProductButtons(buttonsElement) {
  const toggleFormFooterStickiness = () => {
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
    buttonsElement.classList.toggle('product__buttons--sticked', !isAtBottom);
  };

  const setPageBottomIndent = () => {
    if (!laptopWidthMediaQueryList.matches) {
      const bottomValue = parseFloat(getComputedStyle(buttonsElement).bottom);
      document.body.style.paddingBottom = `${buttonsElement.offsetHeight + bottomValue}px`;
    } else {
      document.body.style.paddingBottom = 0;
    }
  };

  const onWindowResize = debounce(setPageBottomIndent, 500);
  const onWindowScroll = throttle(toggleFormFooterStickiness, 100);

  toggleFormFooterStickiness();
  setPageBottomIndent();

  window.addEventListener('scroll', onWindowScroll);
  window.addEventListener('resize', onWindowResize);
}
/* * * * * * * * * * * * * * * * * * * * * * * */
