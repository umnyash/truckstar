/* * * * * * * * * * * * * * * * * * * * * * * *
 * contacts-modal-map.js
 */
function initContactsModal(modalElement, openModal) {

  document.querySelectorAll(`[data-modal-opener="contacts-map"]`).forEach((openerElement) => {
    const locationsList = modalElement.querySelector('.contacts-maps__list');
    openerElement.addEventListener('click', (evt) => {
      evt.preventDefault();
      const locationId = evt.target.dataset.locationId;

      locationsList.dataset.activeItem = locationId;
      openModal(modalElement);
    });
  });
}
/* * * * * * * * * * * * * * * * * * * * * * * */
