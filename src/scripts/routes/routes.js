import HomePage from '../pages/home/home-page';
import AboutPage from '../pages/about/about-page';
import LoginPage from '../pages/login/login-page';
import RegisterPage from '../pages/register/register-page';
import AddStoryPage from '../pages/add/add-story-page';
import LogoutPage from '../pages/logout/logout-page';
import DetailPage from '../pages/detail/detail-page.js';
import MapPage from '../pages/maps/map-page.js';

const routes = {
  '/': new HomePage(),
  '/home': new HomePage(),
  '/about': new AboutPage(),
  '/login': new LoginPage(),
  '/register': new RegisterPage(),
  '/add': new AddStoryPage(),
  '/logout': new LogoutPage(),
  '/detail/:id': new DetailPage(),
  '/maps': new MapPage(),
};

export default routes;
