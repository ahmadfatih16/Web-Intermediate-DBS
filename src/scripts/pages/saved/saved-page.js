import { getAllStories, deleteStory } from '../../utils/idb-helper.js';

export default class SavedPage {
  async render() {
    return `
      <section class="container">
        <h1>Cerita Tersimpan (Offline)</h1>
        <div id="saved-stories">Memuat cerita...</div>
      </section>
    `;
  }

  async afterRender() {
    const stories = await getAllStories();

    const container = document.getElementById('saved-stories');
    container.innerHTML = '';

    if (stories.length === 0) {
      container.innerHTML = '<p>Tidak ada cerita offline.</p>';
      return;
    }

    stories.forEach(story => {
      container.innerHTML += `
        <div class="story-card">
          <img src="${story.photoUrl}" alt="Offline story image" />
          <h3>${story.name}</h3>
          <p>${story.description}</p>
          <button class="delete-button" data-id="${story.id}">Hapus</button>
        </div>
      `;
    });

    container.querySelectorAll('.delete-button').forEach(button => {
      button.addEventListener('click', async (e) => {
        const id = e.target.dataset.id;
        await deleteStory(id);
        this.afterRender(); // refresh daftar
      });
    });
  }
}
