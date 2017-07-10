const passport = require('passport');
const config = require('../main');
const User = require('../../models/userModel');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

const strategySettings = {
	jwtFromRequest: ExtractJwt.fromAuthHeader(),
	secretOrKey: config.secret
};

const strategyCallback = (payload, done) => {
	User.findById(payload._id, (err, user) => {
		if (err) return done(err);

		if (user) {
			done(null, user);
		} else {
			done(null, false, {error: 'User not found'});
		}
	})
}

const jwtStrategy = () => {
	passport.use(new JwtStrategy(strategySettings, strategyCallback));
}

module.exports = jwtStrategy;