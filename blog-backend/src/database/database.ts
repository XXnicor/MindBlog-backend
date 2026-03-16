import pool from '../config/database';

export const testConnection = async (): Promise<void> => {
  try {
    await pool.query('SELECT 1');
    console.log('✅ Conexão com PostgreSQL validada!');
  } catch (error) {
    console.error('❌ Erro ao conectar com PostgreSQL:', error);
    throw error;
  }
};

export default pool;
