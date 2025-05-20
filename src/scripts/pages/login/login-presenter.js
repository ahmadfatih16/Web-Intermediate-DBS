import { login } from '../../data/api.js';

export default class LoginPresenter {
  constructor(view) {
    this._view = view;
  }

  async handleLogin({ email, password }) {
    try {
      const result = await login({ email, password });

      if (result.error) {
        this._view.showMessage(result.message);
        return;
      }

      localStorage.setItem('authToken', result.loginResult.token);
      this._view.showMessage('Login berhasil. Mengalihkan ke beranda...');
      setTimeout(() => {
        this._view.redirectToHome();
      }, 1000);
    } catch (err) {
      this._view.showMessage('Login gagal. Coba lagi.');
    }
  }
}
