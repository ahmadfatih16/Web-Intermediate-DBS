export function showFormattedDate(date, locale = 'en-US', options = {}) {
  return new Date(date).toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...options,
  });
}

export function sleep(time = 1000) {
  return new Promise((resolve) => setTimeout(resolve, time));
}


const isServiceWorkerAvailable = () => {
  return 'serviceWorker' in navigator;
};

const registerServiceWorker = async () => {
  if (!isServiceWorkerAvailable()) {
    console.log('Service Worker API unsupported');
    return null;
  }

  try {
    const registration = await navigator.serviceWorker.register('/sw.js');
    console.log('Service worker telah terpasang', registration);
    return registration;
  } catch (error) {
    console.log('Failed to install service worker:', error);
    return null;
  }
};

export { registerServiceWorker, isServiceWorkerAvailable };