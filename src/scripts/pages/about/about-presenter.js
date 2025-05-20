export default class AboutPresenter {
    constructor(view) {
      this.view = view;
    }
  
    checkAuth() {
      const token = localStorage.getItem('authToken');
      if (!token) {
        this.view.redirectToLogin();
      }
    }
  }
  