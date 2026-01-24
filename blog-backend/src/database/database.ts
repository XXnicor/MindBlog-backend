import connection from './connection';

export const testConnection = async (): Promise<void> => {
  try {
    await connection.execute('SELECT 1');
    console.log('✅ Conexão com MySQL validada!');
  } catch (error) {
    console.error('❌ Erro ao conectar com MySQL:', error);
    throw error;
  }
};

export default connection;