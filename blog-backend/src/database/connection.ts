import mysql from 'mysql2';
import { config } from '../config/env.config';

const connection = mysql.createPool({
  host: config.database.host,
  port: config.database.port,
  user: config.database.user,
  password: config.database.password,
  database: config.database.name,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

connection.getConnection((err, conn) => {
  if (err) {
    console.error('❌ Erro ao conectar no MySQL:', err.message);
    process.exit(1); // Fail-fast: não inicia se DB inacessível
  } else {
    console.log('✅ Conectado ao MySQL com sucesso!');
    conn.release();
  }
});

// TODO: Exporte a versão promise() para usar async/await
export default connection.promise();