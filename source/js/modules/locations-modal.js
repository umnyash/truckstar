/* * * * * * * * * * * * * * * * * * * * * * * *
 * contacts-modal-map.js
 */
async function initLocationsModal(modalElement) {
  const headingElement = modalElement.querySelector('.modal-locations__heading');
  const locationsList = modalElement.querySelector('.locations__list');
  const mapElements = locationsList.querySelectorAll('.map');
  const maps = [];

  for (const mapElement of mapElements) {
    const map = await initMap(mapElement);
    maps.push(map);
  }

  new Modal(modalElement, {
    onOpenerClick: (evt) => {
      maps.forEach((map) => map.reset());

      const text = evt.target.closest('.checker-cards__item-label').textContent;
      const locationId = evt.target.dataset.locationId;
      locationsList.dataset.activeItem = locationId;
      headingElement.textContent = text;
    },
  });
}
/* * * * * * * * * * * * * * * * * * * * * * * */
