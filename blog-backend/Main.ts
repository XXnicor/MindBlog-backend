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


app.use(cors(
    {
        origin: 'http://localhost:3000',
        credentials: true
    }
));


app.use(express.json());

// Repositories
const articleRepository = new ArticleRepository();
const userRepository = new UserRepository();
const commentRepository = new CommentRepository();

// Services
const articleService = new ArticleService(articleRepository);
const userService = new UserService(userRepository);
const commentService = new CommentService(commentRepository);

// Controllers
const articleController = new ArticleController(articleService);
const userController = new UserController(userService);
const commentController = new CommentController(commentService);

// Middleware
const authMiddleware = new AuthMiddleware();

// Routes
const authRoutes = createAuthRoutes(userController, authMiddleware);
const userRoutes = createUserRoutes(userController, authMiddleware);
const articleRoutes = createArticleRoutes(articleController, authMiddleware);
const commentRoutes = createCommentRoutes(commentController, authMiddleware);


const PORT = process.env.PORT || config.server.port;

app.get('/', (req, res) => {
    res.json({ message: 'Backend do Blog MindGroup rodando!' });
});

// Registrar todas as rotas
app.use('/api', authRoutes);
app.use('/api', userRoutes);
app.use('/api', articleRoutes);
app.use('/api', commentRoutes);

// Servir arquivos estáticos da pasta uploads
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// Error handler (deve vir depois das rotas)
app.use(errorHandler);



app.listen(config.server.port, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
    console.log(`Ambiente: ${process.env.NODE_ENV}`);
});
