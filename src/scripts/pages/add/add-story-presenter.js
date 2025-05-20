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
        this.#view.showError(error.message);
      }
    }
  }
  