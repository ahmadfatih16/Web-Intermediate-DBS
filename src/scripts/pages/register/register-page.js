import { register } from '../../data/api';

export default class RegisterPage {
  async render() {
    return `
      <section class="register-page">
        <h2>Register</h2>
        <form id="register-form">
          <div>
            <label for="name">Name</label>
            <input type="text" id="name" required />
          </div>
          <div>
            <label for="email">Email</label>
            <input type="email" id="email" required />
          </div>
          <div>
            <label for="password">Password</label>
            <input type="password" id="password" required minlength="8" />
          </div>
          <button type="submit">Register</button>
        </form>
        <div id="register-message"></div>
      </section>
    `;
  }

  async afterRender() {
    const form = document.querySelector('#register-form');
    const message = document.querySelector('#register-message');

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const name = document.querySelector('#name').value;
      const email = document.querySelector('#email').value;
      const password = document.querySelector('#password').value;

      try {
        const response = await register({ name, email, password });
        if (!response.error) {
          message.textContent = 'Registrasi berhasil. Silakan login.';
          setTimeout(() => {
            window.location.hash = '/login';
          }, 1500);
        } else {
          message.textContent = response.message;
        }
      } catch (error) {
        message.textContent = 'Registrasi gagal. Coba lagi.';
      }
    });
  }
}
