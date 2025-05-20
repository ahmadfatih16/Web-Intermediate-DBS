/* eslint-disable no-restricted-globals */
// Service Worker untuk Push Notification

self.addEventListener('push', (event) => {
  console.log('Service worker pushing...');

  let notificationData = {};
  
  try {
    notificationData = event.data ? event.data.json() : {};
  } catch (error) {
    notificationData = {};
  }
  
  const title = notificationData.title || 'Stories App Notification';
  const options = {
    body: notificationData.body || 'New story has been posted!',
    icon: '/favicon.png',
    badge: '/favicon.png',
    vibrate: [100, 50, 100],
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// Menangani klik pada notification
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  // Buka aplikasi jika notification diklik
  const urlToOpen = '/';
  
  event.waitUntil(
    self.clients.matchAll({
      type: 'window',
      includeUncontrolled: true,
    }).then((windowClients) => {
      // Cek apakah sudah ada tab yang terbuka
      const hadWindowToFocus = windowClients.some((windowClient) => {
        if (windowClient.url.includes(urlToOpen)) {
          windowClient.focus();
          return true;
        }
        return false;
      });
      
      // Buka tab baru jika belum ada
      if (!hadWindowToFocus) {
        self.clients.openWindow(urlToOpen);
      }
    }),
  );
});