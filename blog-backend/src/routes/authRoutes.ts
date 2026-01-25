
import { Router } from 'express';
import { UserController } from '../controllers/UserController';
import { AuthMiddleware } from '../middlewares/authMiddleware';

export function createAuthRoutes(
  userController: UserController,
  authMiddleware: AuthMiddleware
): Router {

  const router = Router();

  router.post('/auth/register', userController.register);
  router.post('/auth/login', userController.login);
  router.get('/auth/me', authMiddleware.authenticate, userController.me);

  return router;
}