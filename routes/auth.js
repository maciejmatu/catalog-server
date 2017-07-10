const express = require('express');
const AuthController = require('../controllers/authentication');
const passportService = require('../config/passport')();
const passport = require('passport');

const routes = (app) => {
	const router = express.Router();
	const requireLogin = passport.authenticate('local', { session: false });

  /**
   * @title Register Route
   *
   * @desc Registers new user
   *
   * @url /auth/register
   * @method POST
   *
   * @data email
   * @data password
   * @data age
   * @data displayName
   *
   * @success-code 200
   * @success-content
   * {
   *    token,
   *    user {
   *      _id,
   *      displayName,
   *      email,
   *      role
   *    }
   * }
   *
   * @error-code 422
   * @error-content {error}
   *
   * @sample-call
   * $.ajax({
   *    url: '/auth/register',
   *    dataType: 'json',
   *    data: {
   *      email: 'example@mail.com',
   *      password: 'kitty123',
   *      age: 20,
   *      displayName: 'sampleman'
   *    },
   *    type: 'POST',
   *    success: function(res) {}
   * });
   *
   * @note This is still in development.
   */
	router.route('/register').post(AuthController.register);

  /**
   * @title Login Route
   * @desc Logins new user
   *
   * @url /auth/login
   * @method POST
   *
   * @data email - user email
   * @data password - user password
   *
   * @success-code 201
   * @success-content {token: 'JWT sometoken', user: userObject}
   *
   * @sample-call
   * $.ajax({
   *    url: '/auth/login',
   *    dataType: 'json',
   *    data: {
   *      email: 'example@email.com',
   *      password: 'kitty123'
   *    }
   * })
   */
	router.route('/login').post(requireLogin, AuthController.login);


	router.route('/forgot-password').post(AuthController.forgotPassword);


	router.route('/reset-password/:token').post( AuthController.verifyToken);

	return router;
}

module.exports = routes;