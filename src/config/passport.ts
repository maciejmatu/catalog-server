import jwtStrategy from './strategies/jwt.strategy';
import localStrategy from './strategies/local.strategy';

const config = () => {
	jwtStrategy();
	localStrategy();
}

export default config;
