import CONFIG from '../config';

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

console.log('VAPID PUBLIC KEY:', CONFIG.PUSH_MSG_VAPID_PUBLIC_KEY);
console.log('Converted applicationServerKey:', urlBase64ToUint8Array(CONFIG.PUSH_MSG_VAPID_PUBLIC_KEY));
console.log('Raw VAPID key:', CONFIG.PUSH_MSG_VAPID_PUBLIC_KEY);


async function subscribePushNotification(registration) {
  try {
    const token = localStorage.getItem('authToken');
    if (!token) {
      console.log('User is not logged in, cannot subscribe to push notification');
      return;
    }

    if (Notification.permission !== 'granted') {
      const status = await Notification.requestPermission();
      if (status !== 'granted') {
        console.log('Notification permission denied');
        return;
      }
    }

    // Cek subscription lama
    const existingSubscription = await registration.pushManager.getSubscription();

    if (existingSubscription) {
      // Cek apakah applicationServerKey sama (tidak bisa dicek langsung, jadi biasanya kita hapus dulu)
      console.log('Existing subscription found, unsubscribing first...');
      await existingSubscription.unsubscribe();
    }

    // Lanjut subscribe baru
    const subscribeOptions = {
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(CONFIG.PUSH_MSG_VAPID_PUBLIC_KEY),
    };

    const pushSubscription = await registration.pushManager.subscribe(subscribeOptions);
    console.log('Push notification subscription:', JSON.stringify(pushSubscription));

    const subscriptionJSON = pushSubscription.toJSON();

    const response = await fetch(CONFIG.PUSH_MSG_SUBSCRIBE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        endpoint: subscriptionJSON.endpoint,
        keys: {
          p256dh: subscriptionJSON.keys.p256dh,
          auth: subscriptionJSON.keys.auth,
        },
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to subscribe to push notification on server');
    }

    console.log('Successfully subscribed to push notification');
  } catch (error) {
    console.error('Failed to subscribe to push notification:', error);
  }
}


async function unsubscribePushNotification(registration) {
  try {
    const subscription = await registration.pushManager.getSubscription();
    if (!subscription) {
      console.log('No subscription found to unsubscribe');
      return;
    }

    const token = localStorage.getItem('authToken');
    if (!token) {
      console.log('User is not logged in, cannot unsubscribe from push notification');
      return;
    }

    const response = await fetch(CONFIG.PUSH_MSG_UNSUBSCRIBE_URL, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        endpoint: subscription.endpoint,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to unsubscribe from push notification on server');
    }

    const result = await subscription.unsubscribe();
    console.log('Push notification unsubscribed:', result);
  } catch (error) {
    console.error('Failed to unsubscribe from push notification:', error);
  }
}

export { subscribePushNotification, unsubscribePushNotification };
