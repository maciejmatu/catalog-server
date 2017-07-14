import { Router } from 'express';
import * as AuthController from '../controllers/authentication';
import { authenticate } from 'passport';
import { requireLogin } from '../strategies';

export default Router()
  .post('/register', AuthController.register)
  .post('/login', requireLogin, AuthController.login)
  .post('/forgot-password', AuthController.forgotPassword)
  .post('/reset-password', AuthController.verifyPasswordResetToken);
