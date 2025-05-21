import '../styles/styles.css';
import 'leaflet/dist/leaflet.css';
import App from './pages/app';
import { registerServiceWorker } from './utils';
import { subscribePushNotification } from './utils/push-notification-helper';

document.addEventListener('DOMContentLoaded', async () => {
  const app = new App({
    content: document.querySelector('#main-content'),
    drawerButton: document.querySelector('#drawer-button'),
    navigationDrawer: document.querySelector('#navigation-drawer'),
  });

  const logoutItem = document.getElementById('logout-item'); 
  const token = localStorage.getItem('authToken');
  if (logoutItem) {
    logoutItem.style.display = token ? 'list-item' : 'none';
  }

  await app.renderPage();

  window.addEventListener('hashchange', async () => {
    await app.renderPage();
  });

  // ✅ Daftarkan service worker jika didukung
  if ('serviceWorker' in navigator && 'PushManager' in window) {
    try {
      const registration = await registerServiceWorker();
      console.log('Service Worker registered');

      if (token) {
        await subscribePushNotification(registration);
      }
    } catch (error) {
      console.error('SW registration or push subscription failed:', error);
    }
  } else {
    console.warn('Service Worker or PushManager not supported in this browser.');
  }
});

// 🔁 Tetap pertahankan ini untuk stop stream kamera saat hashchange
window.addEventListener('hashchange', () => {
  if (Array.isArray(window.currentStreams)) {
    window.currentStreams.forEach((stream) => {
      if (stream.active) {
        stream.getTracks().forEach((track) => track.stop());
      }
    });
    window.currentStreams = [];
  }
});
