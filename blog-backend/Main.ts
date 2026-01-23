import express from 'express';
import cors from 'cors';
import './database/connection'; // Importa para testar a conexão ao iniciar

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.json({ message: 'Backend do Blog MindGroup rodando!' });
});

app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
});