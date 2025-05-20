import CONFIG from '../config';

const NotificationHelper = {
  sendNotification({ title, options }) {
    if (!this._checkAvailability()) {
      return null;
    }

    if (!this._checkPermission()) {
      console.error('User did not yet grant permission');
      this._requestPermission();
      return null;
    }

    return self.registration.showNotification(title, options);
  },

  async _requestPermission() {
    const status = await Notification.requestPermission();
    
    if (status === 'denied') {
      console.error('Notification permission denied');
    }

    if (status === 'default') {
      console.error('Permission request dismissed');
    }

    return status === 'granted';
  },

  async _checkPermission() {
    return Notification.permission === 'granted';
  },

  _checkAvailability() {
    return Boolean('Notification' in window);
  },
};

export default NotificationHelper;