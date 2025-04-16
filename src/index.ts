import cors from 'cors';
import App from './app';
import routes from './routes';

const middleWares = [cors()];

const app = new App({
  port: parseInt(process.env.APP_PORT) || 4044,
  apiPrefix: '/api/v1',
  middleWares,
  routes,
});

app.listen();
