/* * * * * * * * * * * * * * * * * * * * * * * *
 * map.js
 */
async function initMap(mapElement) {
  const latitude = mapElement.dataset.latitude;
  const longitude = mapElement.dataset.longitude;
  const zoom = mapElement.dataset.zoom;
  // const COORDINATES = [44.008906, 56.323592];

  // 56.302058, 43.574579
  const coordinates = [longitude, latitude];
  console.log(coordinates)
  const containerElement = mapElement.querySelector('.map__inner');

  containerElement.classList.remove('map__inner--hidden');
  containerElement.style.filter = 'hue-rotate(-180deg) grayscale(0.9)';

  await ymaps3.ready;

  const {
    YMap,
    YMapDefaultSchemeLayer,
    YMapMarker,
    YMapDefaultFeaturesLayer
  } = ymaps3;

  const map = new YMap(
    containerElement,
    {
      location: {
        center: coordinates,
        zoom
      }
    }
  );

  map.addChild(new YMapDefaultSchemeLayer());
  map.addChild(new YMapDefaultFeaturesLayer());

  const markerElement = document
    .querySelector('#map-marker-template')
    .content
    .querySelector('.map-marker')
    .cloneNode(true);

  const marker = new YMapMarker(
    {
      coordinates: coordinates,
    },
    markerElement
  );

  const timerId = setInterval(() => {
    const canvasElement = mapElement.querySelector('canvas');

    if (canvasElement) {
      clearInterval(timerId);
      canvasElement.style.filter = 'hue-rotate(-180deg) grayscale(0.9)';
      containerElement.style.filter = '';
      map.addChild(marker);
    }
  }, 1000);
}
/* * * * * * * * * * * * * * * * * * * * * * * */
