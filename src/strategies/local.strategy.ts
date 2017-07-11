import * as passport from 'passport';
import User from '../models/userModel';
import { Strategy as LocalStrategy } from 'passport-local';

passport.use(new LocalStrategy(
  {
    usernameField: 'email'
  },
  (email, password, done) => {
    User.findOne({ email })
      .select('+password')
      .then(user => {
        if (user) {
          user.comparePasswords(password, (err, isMatch) => {
            if (err) return done(err);

            if (isMatch) {
              return done(null, user);
            } else {
              return done(null, false, { error: 'Incorrect password' });
            }
          });
        } else {
          return done(null, false, { error: 'User not found' });
        }
      })
      .catch(err => done(err));
  }
));
