import { authenticate } from 'passport';
import './local.strategy';
import './jwt.strategy';

function strategy(name) {
  return (req, res, next) => {
    authenticate(name, (err, user, info) => {
      if (err) return next(err);
      if (!user) return res.json(info);

      req.user = user;
      next();
    })(req, res, next);
  };
}

export const requireLogin = strategy('local');
export const requireAuth = strategy('jwt');
