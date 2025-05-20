import AboutPresenter from './about-presenter.js';

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
      </section>
    `;
  }

  async afterRender() {
    const presenter = new AboutPresenter(this);
    presenter.checkAuth();
  }

  redirectToLogin() {
    window.location.hash = '/login';
  }
}
