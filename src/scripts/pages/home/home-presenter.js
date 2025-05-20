export default class HomePresenter {
    #view;
    #model;
  
    constructor({ view, model }) {
      this.#view = view;
      this.#model = model;
    }
  
    async loadStories(token) {
      try {
        const data = await this.#model.getStories(token);
        this.#view.displayStories(data.listStory);
      } catch (error) {
        this.#view.displayError(error.message);
      }
    }
  }