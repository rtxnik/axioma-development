let center = [55.7314914873887, 37.21793712698363];

function init() {
  let map = new ymaps.Map("map", {
    center: center,
    zoom: 17
  });

  let placemark = new ymaps.Placemark(
    center,
    {},
    {
      iconLayout: "default#image",
      iconImageHref: "https://cdn-icons-png.flaticon.com/128/5817/5817230.png",
      iconImageSize: [40, 40],
      iconImageOffset: [-19, -44]
    }
  );

  map.controls.remove("geolocationControl");
  map.controls.remove("searchControl");
  map.controls.remove("trafficControl");
  map.controls.remove("typeSelector");
  map.controls.remove("fullscreenControl");
  map.controls.remove("zoomControl");
  map.controls.remove("rulerControl");
  // map.behaviors.disable(['scrollZoom']);

  map.geoObjects.add(placemark);
}

ymaps.ready(init);
