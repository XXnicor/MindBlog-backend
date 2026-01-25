// src/routes/articleRoutes.ts
import { Router } from 'express';
import { ArticleController } from '../controllers/ArticleController';
import { AuthMiddleware } from '../middlewares/authMiddleware';

export function createArticleRoutes(
  articleController: ArticleController,
  authMiddleware: AuthMiddleware
): Router {
  const router = Router();

    router.get('/articles', articleController.listAll);

    router.get('/articles/:id', articleController.getById);

    router.post('/articles', authMiddleware.authenticate, articleController.create);

    router.put('/articles/:id', authMiddleware.authenticate, articleController.update);

    router.delete('/articles/:id', authMiddleware.authenticate, articleController.delete);
    
  return router;
}