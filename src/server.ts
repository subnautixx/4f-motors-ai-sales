import { buildApp } from './app.js';
import { initDatabase } from './database/connection.js';
import './database/seed.js';
import { config } from './utils/config.js';

initDatabase();

const app = buildApp();

app.listen(config.port, () => {
  console.log(`🚗 4F Motors AI MVP rodando em http://localhost:${config.port}`);
});
