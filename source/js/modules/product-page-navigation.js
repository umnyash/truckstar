/* * * * * * * * * * * * * * * * * * * * * * * *
 * product-navigation.js
 */
function initProductNavigation(navigationElement) {
  const siteHeaderElement = document.querySelector('.page__site-header');

  navigationElement.addEventListener('click', (evt) => {
    evt.preventDefault();
    const id = evt.target.getAttribute('href');
    const targetElement = document.querySelector(id);

    if (targetElement) {
      const targetElementPosition = targetElement.getBoundingClientRect().top + window.scrollY;

      window.scrollTo({
        top: targetElementPosition - siteHeaderElement.offsetHeight - 20,
        behavior: 'smooth'
      })

      if (targetElement.matches('.folds__item:not(.folds__item--open)')) {
        targetElement.querySelector('.folds__button').click();
      }
    }
  });
}
/* * * * * * * * * * * * * * * * * * * * * * * */
