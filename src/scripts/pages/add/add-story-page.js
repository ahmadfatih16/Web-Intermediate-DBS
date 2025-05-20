import L from 'leaflet';
import * as StoryModel from '../../data/api.js';
import AddStoryPresenter from './add-story-presenter.js';

export default class AddStoryPage {
  #presenter;
  #capturedBlob = null;
  #lat = -7.797068;
  #lon = 110.370529;

  async render() {
    return `
      <section class="add-story-page">
        <h2>Add New Story</h2>
        <form id="add-story-form">
          <label for="description">Description</label>
          <textarea id="description" required></textarea>

          <label for="photo">Photo</label>
          <input type="file" id="photo" accept="image/*" />
          <button type="button" id="start-camera">Use Camera</button>
          <video id="camera-stream" width="300" autoplay style="display:none;"></video>
          <canvas id="snapshot" style="display:none;"></canvas>
          <button type="button" id="take-photo" style="display:none;">Take Photo</button>

          <div id="map-container" style="height: 300px; margin-top: 1rem;"></div>

          <button type="submit">Add Story</button>
        </form>
        <div id="message"></div>
      </section>
    `;
  }

  async afterRender() {
    const token = localStorage.getItem('authToken');
    if (!token) {
      window.location.hash = '/login';
      return;
    }

    this.#presenter = new AddStoryPresenter({ view: this, model: StoryModel });

    this.#initMap();
    this.#initCamera();
    this.#initForm();
  }

  #initMap() {
    const map = L.map('map-container').setView([this.#lat, this.#lon], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

    const marker = L.marker([this.#lat, this.#lon], { draggable: true }).addTo(map);
    marker.on('dragend', (e) => {
      const pos = e.target.getLatLng();
      this.#lat = pos.lat;
      this.#lon = pos.lng;
    });

    map.on('click', (e) => {
      this.#lat = e.latlng.lat;
      this.#lon = e.latlng.lng;
      marker.setLatLng([this.#lat, this.#lon]);
    });
  }

  #initCamera() {
    const startBtn = document.getElementById('start-camera');
    const video = document.getElementById('camera-stream');
    const canvas = document.getElementById('snapshot');
    const takePhotoBtn = document.getElementById('take-photo');
    const fileInput = document.getElementById('photo');

    startBtn.addEventListener('click', async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        video.srcObject = stream;
        video.style.display = 'block';
        takePhotoBtn.style.display = 'inline-block';
        fileInput.disabled = true;

        // ✅ Simpan ke global context
        if (!Array.isArray(window.currentStreams)) {
          window.currentStreams = [];
        }
        window.currentStreams.push(stream);
      } catch {
        this.showError('Camera access denied or not available.');
      }
    });

    takePhotoBtn.addEventListener('click', () => {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas.getContext('2d').drawImage(video, 0, 0);
      canvas.toBlob((blob) => {
        this.#capturedBlob = blob;
      }, 'image/jpeg');

      video.style.display = 'none';
      takePhotoBtn.style.display = 'none';
      startBtn.disabled = true;

      this.#stopCamera(); // Optional local stop
    });
  }

  #stopCamera() {
    if (Array.isArray(window.currentStreams)) {
      window.currentStreams.forEach((stream) => {
        if (stream.active) {
          stream.getTracks().forEach((track) => track.stop());
        }
      });
      window.currentStreams = [];
    }
  }

  #initForm() {
    const form = document.getElementById('add-story-form');
    const fileInput = document.getElementById('photo');

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const description = document.getElementById('description').value;
      const photo = this.#capturedBlob || fileInput.files[0];

      if (!photo) {
        this.showError('Please upload or take a photo.');
        return;
      }

      this.#presenter.submit({
        description,
        photo,
        lat: this.#lat,
        lon: this.#lon,
      });
    });
  }

  showSuccess(message) {
    this.#showMessage(message, 'green');
    document.getElementById('add-story-form').reset();
    this.#capturedBlob = null;
  }

  showError(message) {
    this.#showMessage(`Error: ${message}`, 'red');
  }

  #showMessage(text, color) {
    const msgEl = document.getElementById('message');
    msgEl.textContent = text;
    msgEl.style.color = color;
  }

  redirectToLogin() {
    window.location.hash = '/login';
  }
}
