/* * * * * * * * * * * * * * * * * * * * * * * *
 * document.js
 */
function initDocument(documentElement) {
  const contentElement = documentElement.querySelector('.document__content');
  new SimpleBar(contentElement, { autoHide: false });
}
/* * * * * * * * * * * * * * * * * * * * * * * */
