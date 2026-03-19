import 'dotenv/config';

import express from 'express';
import cors, { CorsOptions } from 'cors';
import pool from './config/database';
import { ArticleRepository } from './repositories/ArticleRepository';
import { UserRepository } from './repositories/UserRepository';
import { CommentRepository } from './repositories/CommentRepository';
import { ArticleService } from './services/ArticleService';
import { UserService } from './services/UserService';
import { CommentService } from './services/CommentService';
import { ArticleController } from './controllers/ArticleController';
import { UserController } from './controllers/UserController';
import { CommentController } from './controllers/CommentController';
import { AuthMiddleware } from './middlewares/authMiddleware';
import { createAuthRoutes } from './routes/authRoutes';
import { createUserRoutes } from './routes/userRoutes';
import { createArticleRoutes } from './routes/articleRoutes';
import { createCommentRoutes } from './routes/commentRoutes';
import path from 'path';
import { errorHandler } from './middlewares/errorHandler';

const app = express();
const portEnv = process.env.PORT;
const PORT: number = portEnv ? Number(portEnv) : 3001;

if (Number.isNaN(PORT) || PORT <= 0) {
  throw new Error('Invalid PORT');
}

const envOrigins = (process.env.FRONTEND_URL ?? '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

const allowedOrigins = Array.from(new Set([
  'http://localhost:3000',
  ...envOrigins
]));

const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    if (!origin) {
      callback(null, true);
      return;
    }

    const isAllowed =
      allowedOrigins.includes(origin) ||
      /^https:\/\/.*\.vercel\.app$/.test(origin);

    if (isAllowed) {
      callback(null, true);
      return;
    }

    callback(new Error(`Origem não permitida pelo CORS: ${origin}`));
  },
  credentials: true
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(express.json());

app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.get('/', (_req, res) => {
  res.json({ message: 'Backend do Blog MindGroup rodando!' });
});

const articleRepository = new ArticleRepository();
const userRepository = new UserRepository();
const commentRepository = new CommentRepository();

const articleService = new ArticleService(articleRepository);
const userService = new UserService(userRepository);
const commentService = new CommentService(commentRepository);

const articleController = new ArticleController(articleService);
const userController = new UserController(userService);
const commentController = new CommentController(commentService);

const authMiddleware = new AuthMiddleware();

const authRoutes = createAuthRoutes(userController, authMiddleware);
const userRoutes = createUserRoutes(userController, authMiddleware);
const articleRoutes = createArticleRoutes(articleController, authMiddleware);
const commentRoutes = createCommentRoutes(commentController, authMiddleware);

app.use('/api', authRoutes);
app.use('/api', userRoutes);
app.use('/api', articleRoutes);
app.use('/api', commentRoutes);

const uploadsPath = path.join(__dirname, '../uploads');
app.use('/uploads', express.static(uploadsPath));

app.use('/uploads', (req, res) => {
  res.status(404).json({ error: 'Arquivo não encontrado', path: req.url });
});

app.use(errorHandler);

void pool
  .query('SELECT 1')
  .then(() => console.log('[BOOT] PostgreSQL connection validated'))
  .catch((error) => console.error('[BOOT] PostgreSQL connection failed:', error));

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
