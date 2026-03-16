require('dotenv').config();

import { Pool } from 'pg';
import { config } from './env.config';

const isProduction = config.server.nodeEnv === 'production';

const pool = new Pool({
  host: config.database.host,
  port: config.database.port,
  user: config.database.user,
  password: config.database.password,
  database: config.database.name,
  ssl: isProduction ? { rejectUnauthorized: false } : false,
});

pool.on('error', (error: Error) => {
  console.error('❌ Erro inesperado no pool PostgreSQL:', error);
});

export default pool;
