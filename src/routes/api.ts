import { Router, Request, Response } from 'express';
import { RequestWithUser } from '../definitions';
import { requireRole } from '../controllers/authentication';
import { authenticate } from 'passport';
import { requireLogin, requireAuth } from '../strategies';
import Users, { IUser } from '../models/userModel';
import authRouter from './auth';

const router = Router();
const requireAdmin = requireRole('admin');

router.route('/me')
  .all(requireAuth)
  .get((req: RequestWithUser, res: Response) => {
    Users.findById(req.user._id)
      .then((foundUser: IUser) => res.send(foundUser))
      .catch(console.log);
  });

router.route('/users')
  .all(requireAuth, requireAdmin)
  .get((req: Request, res: Response) => {
    Users.find()
      .then((users: IUser[]) => res.send(users))
      .catch(console.log);
  })

router.use('/auth', authRouter);

export default router;
