/**
 * Google Maps functionality
 * - Initialize map centered on property
 * - Add custom markers for nearby attractions
 * - Filter markers by category
 */

// Map configuration
const MAP_CONFIG = {
  center: { lat: 35.2364, lng: -80.8600 }, // 1604 Walnut View Dr, Charlotte, NC
  zoom: 15,
  styles: [
    {
      featureType: 'poi',
      elementType: 'labels',
      stylers: [{ visibility: 'off' }]
    }
  ]
};

// Property marker
const PROPERTY = {
  position: { lat: 35.2364, lng: -80.8600 },
  title: '1604 Walnut View Dr',
  icon: 'property'
};

// Nearby attractions data (addresses verified Jan 2026)
const ATTRACTIONS = [
  // Coffee & Cafes
  {
    name: 'Not Just Coffee',
    address: '1026 Jay St, Charlotte, NC 28208',
    position: { lat: 35.2295, lng: -80.8475 },
    category: 'coffee',
    distance: '0.8 mi',
    walkTime: '16 min'
  },
  {
    name: 'Platform Coffee',
    address: '919 Berryhill Rd, Suite 104, Charlotte, NC 28208',
    position: { lat: 35.2392, lng: -80.8710 },
    category: 'coffee',
    distance: '0.6 mi',
    walkTime: '12 min'
  },

  // Restaurants & Food
  {
    name: 'Rhino Market & Deli',
    address: '1500 W Morehead St, Suite E, Charlotte, NC 28208',
    position: { lat: 35.2214, lng: -80.8574 },
    category: 'dining',
    distance: '0.5 mi',
    walkTime: '10 min'
  },
  {
    name: 'Pizza Baby West',
    address: '2135 Thrift Rd, Suite 101, Charlotte, NC 28208',
    position: { lat: 35.2282, lng: -80.8878 },
    category: 'dining',
    distance: '0.9 mi',
    walkTime: '18 min'
  },
  {
    name: 'Azul Tacos',
    address: '2122 Thrift Rd A, Charlotte, NC 28208',
    position: { lat: 35.2284, lng: -80.8871 },
    category: 'dining',
    distance: '0.9 mi',
    walkTime: '18 min'
  },
  {
    name: 'Scoop & Scootery',
    address: '2135 Thrift Rd, Suite 103, Charlotte, NC 28208',
    position: { lat: 35.2282, lng: -80.8878 },
    category: 'dining',
    distance: '0.9 mi',
    walkTime: '18 min'
  },
  {
    name: 'Batchmaker',
    address: '901 Berryhill Rd, Suite G, Charlotte, NC 28208',
    position: { lat: 35.2394, lng: -80.8712 },
    category: 'dining',
    distance: '0.6 mi',
    walkTime: '12 min'
  },

  // Breweries & Bars
  {
    name: 'Town Brewing',
    address: '800 Grandin Rd, Charlotte, NC 28208',
    position: { lat: 35.2301, lng: -80.8655 },
    category: 'nightlife',
    distance: '0.4 mi',
    walkTime: '8 min'
  },
  {
    name: 'FreeMore Tavern',
    address: '1500 W Morehead St C, Charlotte, NC 28208',
    position: { lat: 35.2214, lng: -80.8574 },
    category: 'nightlife',
    distance: '0.5 mi',
    walkTime: '10 min'
  },

  // Transit
  {
    name: 'Gold Line Wesley Heights Stop',
    address: 'Frazier Ave & Wesley Heights Way & W Trade St',
    position: { lat: 35.2268, lng: -80.8573 },
    category: 'transit',
    distance: '0.4 mi',
    walkTime: '8 min'
  },

  // Parks & Recreation
  {
    name: 'Frazier Park',
    address: '1201 W 4th St Ext, Charlotte, NC 28202',
    position: { lat: 35.2331, lng: -80.8571 },
    category: 'parks',
    distance: '0.5 mi',
    walkTime: '10 min'
  },
  {
    name: 'Irwin Creek Greenway',
    address: '543 S Burns Ave, Charlotte, NC 28208',
    position: { lat: 35.2267, lng: -80.8595 },
    category: 'parks',
    distance: '0.3 mi',
    walkTime: '6 min'
  },

  // Entertainment
  {
    name: 'Bank of America Stadium',
    address: '800 S Mint St, Charlotte, NC 28202',
    position: { lat: 35.2258, lng: -80.8536 },
    category: 'entertainment',
    distance: '0.5 mi',
    walkTime: '10 min'
  },
  {
    name: 'Spectrum Center',
    address: '333 E Trade St, Charlotte, NC 28202',
    position: { lat: 35.2251, lng: -80.8392 },
    category: 'entertainment',
    distance: '1.2 mi',
    walkTime: '24 min'
  },

  // Community
  {
    name: 'Elevation Church Wesley Heights',
    address: '2215 Thrift Rd, Charlotte, NC 28208',
    position: { lat: 35.2280, lng: -80.8882 },
    category: 'community',
    distance: '0.9 mi',
    walkTime: '18 min'
  }
];

// Category colors
const CATEGORY_COLORS = {
  property: '#B08D5B',    // Gold
  coffee: '#8B4513',      // Brown
  dining: '#DC143C',      // Crimson
  nightlife: '#4B0082',   // Indigo
  transit: '#228B22',     // Forest Green
  parks: '#32CD32',       // Lime Green
  entertainment: '#FF6347', // Tomato
  community: '#6B8E23'    // Olive
};

// Global variables
let map;
let markers = [];
let infoWindow;
let activeFilters = new Set(['all']);

// Initialize map
function initMap() {
  const mapElement = document.getElementById('map');
  if (!mapElement) return;

  // Create map
  map = new google.maps.Map(mapElement, {
    center: MAP_CONFIG.center,
    zoom: MAP_CONFIG.zoom,
    styles: MAP_CONFIG.styles,
    mapTypeControl: false,
    streetViewControl: false,
    fullscreenControl: true
  });

  // Create info window
  infoWindow = new google.maps.InfoWindow();

  // Add property marker
  addPropertyMarker();

  // Add attraction markers
  addAttractionMarkers();

  // Setup filter controls
  setupMapFilters();
}

// Add property marker (special styling)
function addPropertyMarker() {
  const marker = new google.maps.Marker({
    position: PROPERTY.position,
    map: map,
    title: PROPERTY.title,
    icon: {
      path: google.maps.SymbolPath.CIRCLE,
      scale: 12,
      fillColor: CATEGORY_COLORS.property,
      fillOpacity: 1,
      strokeColor: '#FFFFFF',
      strokeWeight: 3
    },
    zIndex: 1000
  });

  marker.addListener('click', () => {
    infoWindow.setContent(`
      <div style="padding: 8px; max-width: 200px;">
        <strong style="color: ${CATEGORY_COLORS.property}; font-size: 14px;">${PROPERTY.title}</strong>
        <p style="margin: 8px 0 0; font-size: 12px; color: #666;">Your future home!</p>
      </div>
    `);
    infoWindow.open(map, marker);
  });

  markers.push({ marker, category: 'property' });
}

// Add attraction markers
function addAttractionMarkers() {
  ATTRACTIONS.forEach(attraction => {
    const marker = new google.maps.Marker({
      position: attraction.position,
      map: map,
      title: attraction.name,
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 8,
        fillColor: CATEGORY_COLORS[attraction.category],
        fillOpacity: 0.9,
        strokeColor: '#FFFFFF',
        strokeWeight: 2
      }
    });

    marker.addListener('click', () => {
      infoWindow.setContent(`
        <div style="padding: 8px; max-width: 220px;">
          <strong style="font-size: 14px;">${attraction.name}</strong>
          <p style="margin: 8px 0 0; font-size: 12px; color: #666;">
            <span style="display: inline-flex; align-items: center; gap: 4px;">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
              ${attraction.distance}
            </span>
            <span style="margin-left: 12px; display: inline-flex; align-items: center; gap: 4px;">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
              ${attraction.walkTime} walk
            </span>
          </p>
        </div>
      `);
      infoWindow.open(map, marker);
    });

    markers.push({ marker, category: attraction.category });
  });
}

// Setup map filter controls
function setupMapFilters() {
  const filterButtons = document.querySelectorAll('.map-filter');

  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      const category = button.dataset.category;

      if (category === 'all') {
        // Reset all filters
        activeFilters.clear();
        activeFilters.add('all');
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
      } else {
        // Toggle specific category
        activeFilters.delete('all');
        document.querySelector('.map-filter[data-category="all"]')?.classList.remove('active');

        if (activeFilters.has(category)) {
          activeFilters.delete(category);
          button.classList.remove('active');
        } else {
          activeFilters.add(category);
          button.classList.add('active');
        }

        // If no filters active, show all
        if (activeFilters.size === 0) {
          activeFilters.add('all');
          document.querySelector('.map-filter[data-category="all"]')?.classList.add('active');
        }
      }

      updateMarkerVisibility();
    });
  });
}

// Update marker visibility based on active filters
function updateMarkerVisibility() {
  markers.forEach(({ marker, category }) => {
    const isVisible = activeFilters.has('all') ||
                     activeFilters.has(category) ||
                     category === 'property';
    marker.setVisible(isVisible);
  });
}

// Fallback for when Google Maps API is not loaded
function initMapFallback() {
  const mapElement = document.getElementById('map');
  if (!mapElement) return;

  mapElement.innerHTML = `
    <div style="
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100%;
      background: linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%);
      color: #666;
      text-align: center;
      padding: 40px;
    ">
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="margin-bottom: 16px; opacity: 0.5;">
        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
        <circle cx="12" cy="10" r="3"/>
      </svg>
      <h3 style="margin-bottom: 8px; font-size: 18px;">Interactive Map</h3>
      <p style="font-size: 14px; max-width: 300px; margin-bottom: 16px;">
        View the property location and nearby attractions including restaurants, transit, and entertainment.
      </p>
      <a
        href="https://www.google.com/maps/place/1604+Walnut+View+Dr,+Charlotte,+NC+28208"
        target="_blank"
        rel="noopener noreferrer"
        style="
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 12px 24px;
          background-color: #B08D5B;
          color: white;
          text-decoration: none;
          border-radius: 4px;
          font-weight: 500;
        "
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
          <polyline points="15 3 21 3 21 9"/>
          <line x1="10" y1="14" x2="21" y2="3"/>
        </svg>
        Open in Google Maps
      </a>
    </div>
  `;
}

// Check if Google Maps loaded
window.initMap = initMap;

// Fallback if Google Maps doesn't load within 5 seconds
setTimeout(() => {
  if (typeof google === 'undefined' || !google.maps) {
    initMapFallback();
  }
}, 5000);
