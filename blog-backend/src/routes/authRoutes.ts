
import { Router } from 'express';
import { UserController } from '../controllers/UserController';

export function createAuthRoutes(userController: UserController,
   
  ): Router {

  const router = Router();

    router.post('/register', userController.register);

    router.post('/login', userController.login);

  return router;
}