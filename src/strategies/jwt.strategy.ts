import * as passport from 'passport';
import config from '../config';
import User from '../models/userModel';
import { Strategy as JwtStrategy } from 'passport-jwt';
import { ExtractJwt } from 'passport-jwt';

passport.use(new JwtStrategy(
  {
    jwtFromRequest: ExtractJwt.fromAuthHeader(),
    secretOrKey: config.secret
  },
  (payload, done) => {
    User.findById(payload._id)
      .then(foundUser => {
        if (foundUser) {
          done(null, foundUser);
        } else {
          done(null, false, { error: 'User not found' });
        }
      })
      .catch(err => done(err));
  }
));
