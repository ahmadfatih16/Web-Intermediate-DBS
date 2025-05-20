import AboutPresenter from './about-presenter.js';
import { subscribePushNotification, unsubscribePushNotification } from '../../utils/push-notification-helper';
import { registerServiceWorker } from '../../utils';


export default class AboutPage {
  async render() {
    return `
      <section class="about-page" aria-labelledby="about-title">
        <h2 id="about-title">Tentang Aplikasi</h2>
        <p>Aplikasi ini adalah platform berbasis web untuk membagikan cerita lengkap dengan foto dan lokasi.</p>
        <h3>Teknologi yang Digunakan</h3>
        <ul>
          <li>HTML5, CSS3, JavaScript (ES6+)</li>
          <li>Single Page Application (SPA)</li>
          <li>View Transition API untuk transisi halus</li>
          <li>LeafletJS untuk peta interaktif</li>
          <li>Web API untuk kamera dan lokasi</li>
        </ul>
        <h3>Dibuat Oleh</h3>
        <p>Ahmad Fatih H — peserta kelas FEBE DBS Coding Camp.</p>

        <button id="subscribe-button">Aktifkan Notifikasi</button>
        <button id="unsubscribe-button" style="display: none;">Nonaktifkan Notifikasi</button>
        <p id="notif-status" aria-live="polite" style="margin-top:10px;"></p>

      </section>
    `;
  }

  async afterRender() {
    const presenter = new AboutPresenter(this);
    presenter.checkAuth();

    const subscribeButton = document.getElementById('subscribe-button');
    const unsubscribeButton = document.getElementById('unsubscribe-button');
    const statusText = document.getElementById('notif-status');
    const token = localStorage.getItem('authToken');

    const registration = await registerServiceWorker();

    // Cek status awal subscription
    const subscription = await registration.pushManager.getSubscription();
    if (subscription) {
      subscribeButton.style.display = 'none';
      unsubscribeButton.style.display = 'inline-block';
      statusText.textContent = 'Notifikasi aktif.';
    }

    subscribeButton.addEventListener('click', async () => {
      await subscribePushNotification(registration);
      subscribeButton.style.display = 'none';
      unsubscribeButton.style.display = 'inline-block';
      statusText.textContent = 'Berhasil mengaktifkan notifikasi.';
    });

    unsubscribeButton.addEventListener('click', async () => {
      await unsubscribePushNotification(registration);
      subscribeButton.style.display = 'inline-block';
      unsubscribeButton.style.display = 'none';
      statusText.textContent = 'Notifikasi dinonaktifkan.';
    });
  }

  redirectToLogin() {
    window.location.hash = '/login';
  }
}
