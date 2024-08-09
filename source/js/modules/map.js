/* * * * * * * * * * * * * * * * * * * * * * * *
 * map.js
 */
async function initMap(mapElement) {
  const latitude = mapElement.dataset.latitude;
  const longitude = mapElement.dataset.longitude;
  const zoom = mapElement.dataset.zoom;
  const center = [longitude, latitude];

  const containerElement = mapElement.querySelector('.map__inner');
  containerElement.style.filter = 'hue-rotate(-180deg) grayscale(0.9)';

  await ymaps3.ready;

  const {
    YMap,
    YMapDefaultSchemeLayer,
    YMapMarker,
    YMapDefaultFeaturesLayer
  } = ymaps3;

  const map = new YMap(containerElement, {
    location: { center, zoom }
  });

  map.addChild(new YMapDefaultSchemeLayer());
  map.addChild(new YMapDefaultFeaturesLayer());

  const markerElement = document
    .querySelector('#map-marker-template')
    .content
    .querySelector('.map-marker')
    .cloneNode(true);

  const marker = new YMapMarker(
    {
      coordinates: center,
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

  map.reset = () => {
    map.setLocation({ center, zoom });
  };

  return map;
}
/* * * * * * * * * * * * * * * * * * * * * * * */
