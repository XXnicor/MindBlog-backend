"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
require("dotenv/config");
require("./src/config/database");
const env_config_1 = require("./src/config/env.config");
const ArticleRepository_1 = require("./src/repositories/ArticleRepository");
const UserRepository_1 = require("./src/repositories/UserRepository");
const CommentRepository_1 = require("./src/repositories/CommentRepository");
const ArticleService_1 = require("./src/services/ArticleService");
const UserService_1 = require("./src/services/UserService");
const CommentService_1 = require("./src/services/CommentService");
const ArticleController_1 = require("./src/controllers/ArticleController");
const UserController_1 = require("./src/controllers/UserController");
const CommentController_1 = require("./src/controllers/CommentController");
const authMiddleware_1 = require("./src/middlewares/authMiddleware");
const authRoutes_1 = require("./src/routes/authRoutes");
const userRoutes_1 = require("./src/routes/userRoutes");
const articleRoutes_1 = require("./src/routes/articleRoutes");
const commentRoutes_1 = require("./src/routes/commentRoutes");
const path_1 = __importDefault(require("path"));
const errorHandler_1 = require("./src/middlewares/errorHandler");
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: 'http://localhost:3000',
    credentials: true
}));
app.use(express_1.default.json());
const articleRepository = new ArticleRepository_1.ArticleRepository();
const userRepository = new UserRepository_1.UserRepository();
const commentRepository = new CommentRepository_1.CommentRepository();
const articleService = new ArticleService_1.ArticleService(articleRepository);
const userService = new UserService_1.UserService(userRepository);
const commentService = new CommentService_1.CommentService(commentRepository);
const articleController = new ArticleController_1.ArticleController(articleService);
const userController = new UserController_1.UserController(userService);
const commentController = new CommentController_1.CommentController(commentService);
const authMiddleware = new authMiddleware_1.AuthMiddleware();
const authRoutes = (0, authRoutes_1.createAuthRoutes)(userController, authMiddleware);
const userRoutes = (0, userRoutes_1.createUserRoutes)(userController, authMiddleware);
const articleRoutes = (0, articleRoutes_1.createArticleRoutes)(articleController, authMiddleware);
const commentRoutes = (0, commentRoutes_1.createCommentRoutes)(commentController, authMiddleware);
const PORT = process.env.PORT || env_config_1.config.server.port;
app.get('/', (req, res) => {
    res.json({ message: 'Backend do Blog MindGroup rodando!' });
});
app.use('/api', authRoutes);
app.use('/api', userRoutes);
app.use('/api', articleRoutes);
app.use('/api', commentRoutes);
const uploadsPath = path_1.default.join(__dirname, 'uploads');
app.use('/uploads', express_1.default.static(uploadsPath));
app.use('/uploads', (req, res, next) => {
    res.status(404).json({ error: 'Arquivo não encontrado', path: req.url });
});
app.use(errorHandler_1.errorHandler);
app.listen(env_config_1.config.server.port, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
