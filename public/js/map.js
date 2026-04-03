// Fallback if not defined
if (typeof lat === 'undefined' || typeof lng === 'undefined') {
    var lat = 28.6139;
    var lng = 77.2090;
}

// Leaflet uses [latitude, longitude]
var map = L.map('map').setView([lat, lng], 13);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

// Add a marker to show the exact location
L.marker([lat, lng]).addTo(map);