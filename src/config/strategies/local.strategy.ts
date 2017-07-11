import * as Passport from 'passport';
import User from '../../models/userModel';
import { Strategy as LocalStrategy } from 'passport-local';

const strategySettings = {
	usernameField: 'email'
}

const strategyCallback = (email, password, done) => {
	User.findOne({email: email}).select('+password').exec((err, user) => {
		if (err) return done(err);

		if (user) {
			user.comparePasswords(password, (err, isMatch) => {
				if (err) return done(err);

				if (isMatch) {
					return done(null, user);
				} else {
					return done(null, false, {error: 'Incorrect password'});
				}
			});
		} else {
			return done(null, false, {error: 'User not found'});
		}
	})
}

const localStrategy = () => {
	Passport.use(new LocalStrategy(strategySettings, strategyCallback));
}

export default localStrategy;
