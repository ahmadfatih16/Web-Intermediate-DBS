import { saveStory as saveOfflineStory } from '../../utils/idb-helper.js';

export default class AddStoryPresenter {
  #view;
  #model;

  constructor({ view, model }) {
    this.#view = view;
    this.#model = model;
  }

  async submit({ description, photo, lat, lon }) {
    const token = localStorage.getItem('authToken');
    if (!token) {
      this.#view.redirectToLogin();
      return;
    }

    const formData = new FormData();
    formData.append('description', description);
    formData.append('photo', photo);
    formData.append('lat', lat);
    formData.append('lon', lon);

    try {
      const response = await this.#model.addStory(formData, token);
      this.#view.showSuccess('Story added successfully!');
    } catch (error) {
      // Jika offline, simpan ke IndexedDB
      if (!navigator.onLine) {
        const offlineStory = {
          id: `offline-${Date.now()}`,
          name: 'Cerita Offline',
          description,
          photoUrl: URL.createObjectURL(photo),
          lat,
          lon,
          createdAt: new Date().toISOString(),
          offline: true
        };

        await saveOfflineStory(offlineStory);
        this.#view.showSuccess('Anda sedang offline. Cerita disimpan lokal dan bisa dilihat di menu "Offline Cerita".');
      } else {
        this.#view.showError(error.message);
      }
    }
  }
}
