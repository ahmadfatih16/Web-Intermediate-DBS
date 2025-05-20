import { login } from '../../data/api';

export default class LoginPage {
  async render() {
    return `
      <section class="login-page">
        <h2>Login</h2>
        <form id="login-form">
          <div>
            <label for="email">Email</label>
            <input type="email" id="email" required />
          </div>
          <div>
            <label for="password">Password</label>
            <input type="password" id="password" required minlength="8" />
          </div>
          <button type="submit">Login</button>
        </form>
        <div id="login-message"></div>
        <p>Belum punya akun? <a href="#/register">Daftar di sini</a></p>
      </section>
    `;
  }

  async afterRender() {
    const form = document.querySelector('#login-form');
    const message = document.querySelector('#login-message');

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const email = document.querySelector('#email').value;
      const password = document.querySelector('#password').value;

      try {
        const response = await login({ email, password });

        if (!response.error) {
          localStorage.setItem('authToken', response.loginResult.token);
          message.textContent = 'Login berhasil. Mengalihkan ke beranda...';
          setTimeout(() => {
            window.location.hash = '/home';  // Redirect ke HomePage
          }, 1000);
        } else {
          message.textContent = response.message;
        }
      } catch (error) {
        message.textContent = 'Login gagal. Coba lagi.';
      }
    });
  }
}
