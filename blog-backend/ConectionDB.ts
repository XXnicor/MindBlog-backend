import mysql from 'mysql2';
import dotenv from 'dotenv';

// Carrega as variáveis do arquivo .env
dotenv.config();

const connection = mysql.createPool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Teste rápido para ver se conectou (aparecerá no terminal)
connection.getConnection((err, conn) => {
    if (err) {
        console.error('❌ Erro ao conectar no MySQL:', err.message);
    } else {
        console.log('✅ Conectado ao MySQL com sucesso!');
        conn.release();
    }
});

export default connection.promise();