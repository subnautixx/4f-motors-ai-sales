import express from 'express';
import { router } from './routes/index.js';

export const buildApp = () => {
  const app = express();
  app.use(express.json({ limit: '2mb' }));
  app.use(router);
  return app;
};
