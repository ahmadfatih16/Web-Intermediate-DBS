import { saveStory, getAllStories } from '../../utils/idb-helper.js';

export default class HomePresenter {
  #view;
  #model;

  constructor({ view, model }) {
    this.#view = view;
    this.#model = model;
  }

  async loadStories(token) {
    try {
      let stories = [];

      if (navigator.onLine) {
        // Ambil dari API
        const data = await this.#model.getStories(token);
        stories = data.listStory;

        // Simpan ke IndexedDB satu per satu
        for (const story of stories) {
          await saveStory(story);
        }
      } else {
        // Offline: ambil dari IndexedDB
        console.warn('Offline mode: loading stories from IndexedDB');
        stories = await getAllStories();
      }

      this.#view.displayStories(stories);
    } catch (error) {
      this.#view.displayError(error.message || 'Gagal memuat data');
    }
  }
}
