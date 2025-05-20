export default class DetailPresenter {
    #view;
    #model;
  
    constructor({ view, model }) {
      this.#view = view;
      this.#model = model;
    }
  
    async loadStory(id, token) {
      try {
        const story = await this.#model.getDetailStory(id, token);
        this.#view.displayStory(story);
      } catch (error) {
        this.#view.displayError(error.message);
      }
    }
  }
  