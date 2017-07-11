import { Router, Request, Response } from 'express';
import { requireRole } from '../controllers/authentication';
import passportService from '../config/passport';
import { authenticate } from 'passport';
import User from '../models/userModel';
import authRouter from './auth';

const router: Router = Router();

passportService();
const requireLogin = authenticate('local', { session: false });
const requireAuth = authenticate('jwt', {session: false});
const requireAdmin = requireRole('admin');

router.route('/me')
  .get((req: Request, res: Response) => {
    User.findById(req.body.user._id)
      .then(foundUser => res.send(foundUser))
      .catch(console.log);

  });

router.route('/users')
  .all(requireAuth, requireAdmin)
  .get((req: Request, res: Response) => {
    User.find()
      .then(users => res.send(users))
      .catch(console.log);
  })

router.use('/auth', authRouter);

export default router;
