import * as StoryModel from '../../data/api.js';
import Map from '../../utils/map.js';

export default class MapsPage {
  #map;

  async render() {
    return `
      <section class="container">
        <h1>Peta Cerita</h1>
        <div id="map" style="height: 500px;"></div>
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

    this.#map = new Map('map');

    try {
      const response = await StoryModel.getStories(token);
      const stories = response.listStory;

      stories.forEach(story => {
        if (story.lat && story.lon) {
          this.#map.addMarkerWithLink({
            latitude: parseFloat(story.lat),
            longitude: parseFloat(story.lon),
            name: story.name,
            description: story.description,
            storyId: story.id 
          });
        }
      });

      this.#map.fitToMarkers(stories);
    } catch (err) {
      document.getElementById('error-message').textContent =
        `Gagal memuat data: ${err.message}`;
    }
  }
}
