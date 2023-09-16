import HomeRoute from '@routes/index';
import userRoutes from '@/routes/auth/user.route';
// import audioRoutes from '@/routes/audio.route';

const routes = [
  {
    path: '/',
    func: HomeRoute,
  },
  {
    path: '/auth',
    func: userRoutes,
  },
  // {
  //   path: '/audio',
  //   func: audioRoutes,
  // },
];

export default routes;
