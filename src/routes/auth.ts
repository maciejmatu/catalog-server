import { Router } from 'express';
import * as AuthController from '../controllers/authentication';
import passportService from '../config/passport';
import { authenticate } from 'passport';

passportService();

const requireLogin = authenticate('local', { session: false })

export default Router()
  .post('/register', AuthController.register)
  .post('/login', requireLogin, AuthController.login)
  // .post('/forgot-password', AuthController.forgotPassword)
  // .post('/reset-password/:token', AuthController.verifyToken);
