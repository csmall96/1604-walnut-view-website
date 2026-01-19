/**
 * Location Map Section
 * Simple Google Maps display showing the property location
 */

// Property location (1604 Walnut View Dr, Charlotte, NC 28208)
const PROPERTY_POSITION = { lat: 35.2364, lng: -80.8600 };

document.addEventListener('DOMContentLoaded', () => {
  initLocationMap();
});

function initLocationMap() {
  const mapElement = document.getElementById('location-map');
  if (!mapElement) return;

  // Wait for Google Maps to load
  if (typeof google === 'undefined' || !google.maps) {
    setTimeout(initLocationMap, 500);
    return;
  }

  const map = new google.maps.Map(mapElement, {
    center: PROPERTY_POSITION,
    zoom: 15,
    styles: [
      { featureType: 'poi', elementType: 'labels', stylers: [{ visibility: 'off' }] }
    ],
    mapTypeControl: false,
    streetViewControl: false,
    fullscreenControl: true,
    zoomControl: true
  });

  // Add property marker with custom home icon
  new google.maps.Marker({
    position: PROPERTY_POSITION,
    map: map,
    title: '1604 Walnut View Dr',
    icon: {
      url: 'data:image/svg+xml,' + encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="56" viewBox="0 0 48 56">
          <!-- Drop shadow -->
          <ellipse cx="24" cy="52" rx="8" ry="3" fill="rgba(0,0,0,0.2)"/>
          <!-- Pin body -->
          <path d="M24 0C12.954 0 4 8.954 4 20c0 14 20 32 20 32s20-18 20-32C44 8.954 35.046 0 24 0z" fill="#B08D5B"/>
          <!-- Pin border -->
          <path d="M24 2C14.059 2 6 10.059 6 20c0 12.5 18 28.5 18 28.5S42 32.5 42 20C42 10.059 33.941 2 24 2z" fill="none" stroke="#FFFFFF" stroke-width="3"/>
          <!-- Inner circle background -->
          <circle cx="24" cy="20" r="12" fill="#FFFFFF"/>
          <!-- Home icon -->
          <path d="M24 11l-9 8v10h6v-6h6v6h6V19l-9-8z" fill="#B08D5B"/>
          <path d="M32 15.5v-3.5h-3v1l3 2.5z" fill="#B08D5B"/>
        </svg>
      `),
      scaledSize: new google.maps.Size(48, 56),
      anchor: new google.maps.Point(24, 52)
    },
    zIndex: 1000
  });
}
