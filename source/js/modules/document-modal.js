/* * * * * * * * * * * * * * * * * * * * * * * *
 * document-modal.js
 */
function initDocumentModal(modalElement) {
  const documentElement = modalElement.querySelector('.document');
  initDocument(documentElement);
  new Modal(modalElement);
}
/* * * * * * * * * * * * * * * * * * * * * * * */
