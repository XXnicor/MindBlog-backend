import { Router } from 'express';
import { UserController } from '../controllers/UserController';
import { AuthMiddleware } from '../middlewares/authMiddleware';
import { upload } from '../middlewares/uploadMiddleware';

export function createUserRoutes(
  userController: UserController,
  authMiddleware: AuthMiddleware
): Router {
  const router = Router();

  // Rotas protegidas
  router.get('/users/my-articles', authMiddleware.authenticate, userController.getMyArticles);
  router.put('/users/profile', authMiddleware.authenticate, upload.single('avatar'), userController.updateProfile);
  router.get('/users/stats', authMiddleware.authenticate, userController.getStats);

  // Rotas públicas
  router.get('/users/:id', userController.getById);
  router.get('/users', userController.getAll);
  router.put('/users/:id', authMiddleware.authenticate, userController.update);
  router.delete('/users/:id', authMiddleware.authenticate, userController.delete);

  return router;
}
