import * as StoryModel from '../../data/api.js';
import HomePresenter from './home-presenter.js';

export default class HomePage {
  #presenter;

  async render() {
    return `
      <section class="container">
        <h1>Home Page</h1>
        <div id="story-list">Loading stories...</div>
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

    this.#presenter = new HomePresenter({ view: this, model: StoryModel });
    this.#presenter.loadStories(token);
  }

  displayStories(stories) {
    const container = document.getElementById('story-list');
    container.innerHTML = '';

    stories.forEach(story => {
      container.innerHTML += `
        <div class="story-card">
          <img src="${story.photoUrl}" alt="${story.name}" />
          <h3>${story.name}</h3>
          <p>${story.description}</p>
          <button class="detail-button" data-id="${story.id}">Lihat Detail Story</button>
        </div>
      `;
    });

    container.querySelectorAll('.detail-button').forEach(button => {
      button.addEventListener('click', (e) => {
        const storyId = e.target.dataset.id;
        window.location.hash = `/detail/${storyId}`;
      });
    });
  }

  displayError(message) {
    const errorContainer = document.getElementById('error-message');
    errorContainer.textContent = `Gagal memuat data: ${message}`;
  }
}
