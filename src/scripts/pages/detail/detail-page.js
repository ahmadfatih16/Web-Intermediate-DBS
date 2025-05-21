import * as StoryModel from '../../data/api.js';
import Map from '../../utils/map.js';
import DetailPresenter from './detail-presenter.js';
import { saveStory, getAllStories } from '../../utils/idb-helper.js';

export default class DetailPage {
  #map;
  #presenter;
  #storyData;

  async render() {
    return `
      <section class="container">
        <h1>Detail Story</h1>
        <div id="story-detail">Loading...</div>
        <div id="error-message" style="color:red;"></div>
      </section>
    `;
  }

  async afterRender() {
    const token = localStorage.getItem('authToken');
    if (!token) {
      window.location.hash = '/login';
      return;
    }

    const storyId = window.location.hash.split('/')[2];
    this.#presenter = new DetailPresenter({ view: this, model: StoryModel });
    this.#presenter.loadStory(storyId, token);
  }

  async displayStory(story) {
    this.#storyData = story;

    const container = document.getElementById('story-detail');

    // Cek apakah cerita sudah tersimpan di IndexedDB
    const savedStories = await getAllStories();
    const isSaved = savedStories.some(item => item.id === story.id);

    container.innerHTML = `
      <div class="story-card">
        <img src="${story.photoUrl}" alt="${story.name}" />
        <h3>${story.name}</h3>
        <p>${story.description}</p>
        <p>Dibuat pada: ${new Date(story.createdAt).toLocaleString()}</p>
        <button id="save-offline-btn" ${isSaved ? 'disabled' : ''}>
          ${isSaved ? 'Sudah Tersimpan' : 'Simpan ke Offline'}
        </button>
        <div id="map" style="height: 400px; margin-top: 16px;"></div>
      </div>
    `;

    if (!isSaved) {
      document.getElementById('save-offline-btn').addEventListener('click', async () => {
        try {
          await saveStory(this.#storyData);
          alert('Cerita berhasil disimpan untuk offline!');
          const btn = document.getElementById('save-offline-btn');
          btn.textContent = 'Sudah Tersimpan';
          btn.disabled = true;
        } catch (err) {
          alert('Gagal menyimpan cerita: ' + err.message);
        }
      });
    }

    if (story.lat && story.lon) {
      this.#map = new Map('map');
      this.#map.addMarker({
        latitude: parseFloat(story.lat),
        longitude: parseFloat(story.lon),
        name: story.name,
        description: story.description,
      });
      this.#map.setView(parseFloat(story.lat), parseFloat(story.lon), 7);
    }
  }

  displayError(message) {
    const errorContainer = document.getElementById('error-message');
    errorContainer.textContent = `Gagal memuat data: ${message}`;
  }
}
