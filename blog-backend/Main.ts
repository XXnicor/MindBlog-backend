import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import './src/database/connection';
import { config } from './src/config/env.config';
import { ArticleRepository } from './src/repositories/ArticleRepository';
import { UserRepository } from './src/repositories/UserRepository';
import { CommentRepository } from './src/repositories/CommentRepository';
import { ArticleService } from './src/services/ArticleService';
import { UserService } from './src/services/UserService';
import { CommentService } from './src/services/CommentService';
import { ArticleController } from './src/controllers/ArticleController';
import { UserController } from './src/controllers/UserController';
import { CommentController } from './src/controllers/CommentController';
import { AuthMiddleware } from './src/middlewares/AuthMiddleware';
import { createAuthRoutes } from './src/routes/authRoutes';
import { createUserRoutes } from './src/routes/userRoutes';
import { createArticleRoutes } from './src/routes/articleRoutes';
import { createCommentRoutes } from './src/routes/commentRoutes';
import path from 'path';
import { errorHandler } from './src/middlewares/errorHandler';

const app = express();

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));

app.use(express.json());

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


const PORT = process.env.PORT || config.server.port;

app.get('/', (req, res) => {
    res.json({ message: 'Backend do Blog MindGroup rodando!' });
});

app.use('/api', authRoutes);
app.use('/api', userRoutes);
app.use('/api', articleRoutes);
app.use('/api', commentRoutes);

const uploadsPath = path.join(__dirname, 'uploads');
app.use('/uploads', express.static(uploadsPath));

app.use('/uploads', (req, res, next) => {
    res.status(404).json({ error: 'Arquivo não encontrado', path: req.url });
});

app.use(errorHandler);

app.listen(config.server.port, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
