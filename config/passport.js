const jwtStrategy = require('./strategies/jwt.strategy');
const localStrategy = require('./strategies/local.strategy');

const config = () => {
	jwtStrategy();
	localStrategy();
}

module.exports = config;