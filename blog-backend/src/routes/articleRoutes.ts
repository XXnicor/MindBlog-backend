// src/routes/articleRoutes.ts
import { Router } from 'express';
import { ArticleController } from '../controllers/ArticleController';
import { AuthMiddleware } from '../middlewares/authMiddleware';
import { upload } from '../middlewares/uploadMiddleware';

export function createArticleRoutes(
  articleController: ArticleController,
  authMiddleware: AuthMiddleware
): Router {
  const router = Router();

  router.get('/articles', articleController.listAll);

  router.get('/articles/:id', articleController.getById);

  router.post('/articles', authMiddleware.authenticate, upload.single('imagem'), articleController.create);

  router.put('/articles/:id', authMiddleware.authenticate, upload.single('imagem'), articleController.update);

  router.delete('/articles/:id', authMiddleware.authenticate, articleController.delete);
    
  return router;
}