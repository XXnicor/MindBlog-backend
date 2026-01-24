// src/routes/articleRoutes.ts
import { Router, RequestHandler } from 'express';
import { ArticleController } from '../controllers/ArticleController';

export function createArticleRoutes(
  articleController: ArticleController,
  authMiddleware: RequestHandler // TODO: Trocar por tipo real do middleware depois
): Router {
  const router = Router();

    router.get('/articles', articleController.listAll);

    router.get('/articles/:id', articleController.getById);

    router.post('/articles', authMiddleware, articleController.create);

    router.put('/articles/:id', authMiddleware, articleController.update);

    router.delete('/articles/:id', authMiddleware, articleController.delete);

  return router;
}