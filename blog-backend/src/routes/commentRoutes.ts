import { Router } from 'express';
import { CommentController } from '../controllers/CommentController';
import { AuthMiddleware } from '../middlewares/authMiddleware';

export function createCommentRoutes(
  commentController: CommentController,
  authMiddleware: AuthMiddleware
): Router {
  const router = Router();

  // Listar comentários de um artigo (público)
  router.get('/articles/:id/comments', commentController.list);

  // Criar comentário (protegido)
  router.post('/articles/:id/comments', authMiddleware.authenticate, commentController.create);

  // Deletar comentário (protegido)
  router.delete('/comments/:id', authMiddleware.authenticate, commentController.delete);

  return router;
}
