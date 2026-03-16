import pool from '../config/database';

void (async () => {
  try {
    await pool.query('SELECT 1');
    console.log('✅ Conectado ao PostgreSQL com sucesso!');
  } catch (error) {
    console.error('❌ Erro ao conectar no PostgreSQL:', error);
    process.exit(1);
  }
})();

export default pool;
