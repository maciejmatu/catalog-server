import * as Passport from 'passport';
import config from '../';
import User from '../../models/userModel';
import { Strategy as JwtStrategy } from 'passport-jwt';
import { ExtractJwt } from 'passport-jwt';

const strategySettings = {
	jwtFromRequest: ExtractJwt.fromAuthHeader(),
	secretOrKey: config.secret
};

const strategyCallback = (payload, done) => {
  User.findById(payload._id)
    .then(foundUser => {
      if (foundUser) {
        done(null, foundUser);
      } else {
        done(null, false, {error: 'User not found'});
      }
    })
    .catch(err => done(err));
}

const jwtStrategy = () => {
	Passport.use(new JwtStrategy(strategySettings, strategyCallback));
}

export default jwtStrategy;
