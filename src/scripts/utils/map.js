import L from 'leaflet';

export default class Map {
  constructor(elementId) {
    this.map = L.map(elementId).setView([-5.0, 120.0], 5); // Pusat peta di Indonesia, zoom level 5
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(this.map);
    this.markers = [];
  }

  addMarker({ latitude, longitude, name, description }) {
    const marker = L.marker([latitude, longitude]).addTo(this.map);
    marker.bindPopup(`
      <b>${name}</b><br/>
      ${description}<br/>
      Latitude: ${latitude}<br/>
      Longitude: ${longitude}
    `);
    this.markers.push(marker);
  }

  addMarkerWithLink({ latitude, longitude, name, description, storyId }) {
    const marker = L.marker([latitude, longitude]).addTo(this.map);

    // Mengubah link menjadi tombol dalam konten popup
    const popupContent = `
      <b>${name}</b><br/>
      ${description}<br/>
      Latitude: ${latitude}<br/>
      Longitude: ${longitude}<br/>
      <button class="detail-button" data-id="${storyId}">Lihat Detail Story</button>
    `;
    
    marker.bindPopup(popupContent);

    // Menambahkan event listener saat popup terbuka
    marker.on('popupopen', () => {
      const button = document.querySelector('.detail-button');
      if (button) {
        button.addEventListener('click', (e) => {
          const storyId = e.target.dataset.id;
          window.location.hash = `/detail/${storyId}`;
        });
      }
    });

    this.markers.push(marker);
  }

  fitToMarkers(stories) {
    if (this.markers.length === 0) return;
    const group = new L.featureGroup(this.markers);
    this.map.fitBounds(group.getBounds()); // Menyesuaikan peta dengan marker yang ada
  }

  focusOn({ latitude, longitude }) {
    this.map.setView([latitude, longitude], 13); // Zoom lebih dekat ke lokasi
  }


  setView(lat, lon, zoom = 13) {
    this.map.setView([lat, lon], zoom);
  }

}
