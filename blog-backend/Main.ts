import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import './src/database/connection';
import { config } from './src/config/env.config';

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || config.server.port;

app.get('/', (req, res) => {
    res.json({ message: 'Backend do Blog MindGroup rodando!' });
});

app.listen(config.server.port, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
    console.log(`Ambiente: ${process.env.NODE_ENV}`);
});