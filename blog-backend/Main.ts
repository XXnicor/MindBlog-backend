import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import './src/database/connection';
import { config } from './src/config/env.config';
import{ArticleRepository} from './src/repositories/ArticleRepository';
import{UserRepository} from './src/repositories/UserRepository';
import {ArticleService} from './src/services/ArticleService';
import {UserService} from './src/services/UserService';
import {ArticleController} from './src/controllers/ArticleController';
import {UserController} from './src/controllers/UserController';
import {AuthMiddleware} from './src/middlewares/AuthMiddleware';
import {createAuthRoutes} from './src/routes/authRoutes';
import {createArticleRoutes} from './src/routes/articleRoutes';
import path from 'path';


const app = express();


app.use(cors());
app.use(express.json());

const articleRepository = new ArticleRepository();
const userRepository = new UserRepository();

const articleService = new ArticleService(articleRepository);
const userService = new UserService(userRepository);

const articleController = new ArticleController(articleService);
const userController = new UserController(userService);

const authMiddleware = new AuthMiddleware();

const authRoutes = createAuthRoutes(userController);
const articleRoutes = createArticleRoutes(articleController, authMiddleware);


const PORT = process.env.PORT || config.server.port;

app.get('/', (req, res) => {
    res.json({ message: 'Backend do Blog MindGroup rodando!' });
});

app.use('/api', authRoutes);
app.use('/api', articleRoutes);
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));



app.listen(config.server.port, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
    console.log(`Ambiente: ${process.env.NODE_ENV}`);
});