const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();
const app = express();

const allowedOrigins = [
  'http://localhost:3000',
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(express.json());

app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));

// Exemplo de rota /api/articles — substitua a query DB pelo seu ORM
app.get('/api/articles', async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    if (page <= 0 || limit <= 0) throw new Error('page/limit inválidos');

    const offset = (page - 1) * limit;

    // Substitua esta simulação pela sua query real ao DB
    const articles = [{
      id: 1,
      title: 'exemplo',
      createdAt: new Date().toISOString()
    }];

    return res.json({ page, limit, offset, data: articles });
  } catch (err) {
    return next(err);
  }
});

// Error handler — log completo e resposta JSON com error.message
app.use((err, req, res, next) => {
  console.error('ERRO REAL:', err && (err.stack || err.message || err));
  const origin = req.headers.origin || process.env.FRONTEND_URL || '*';
  res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.status(500).json({
    message: 'Erro ao listar artigos',
    error: err && (err.message || String(err))
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
