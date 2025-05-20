export default class LogoutPage {
    async render() {
      return '<p>Logging out...</p>';
    }
  
    async afterRender() {
      localStorage.removeItem('authToken');
      window.location.hash = '/login';
    }
  }
  