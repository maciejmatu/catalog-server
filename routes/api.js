const express = require('express');
const AuthController = require('../controllers/authentication');
const passportService = require('../config/passport')();
const passport = require('passport');
const User = require('../models/userModel');

const routes = (app) => {
	const router = express.Router();

	const requireLogin = passport.authenticate('local', { session: false });
	const requireAuth = passport.authenticate('jwt', {session: false});
	const requireAdmin = AuthController.requireRole('admin');

	router.get('/', (req, res) => {
		res.send('It works!');
	})

	router.route('/me')
		.get(requireAuth, (req, res) => {
			User.findById(req.user._id, (err, foundUser) => {
				if (err) {	return next(err);}

				res.send(foundUser);
			});
		})

	router.use('/users', requireAuth, requireAdmin)
	router.route('/users')
		.get((req, res) => {
			User.find({}, (err, users) => {
				res.send(users);
			})
		})

	router.use('/users/:userId', (req, res, next) => {
		User.findById(req.params.userId, (err, user) => {
			if (err) {
				res.status(500).send(err);
			} else if (user) {
				req.foundUser = user
				next();
			} else {
				res.status(404).send('no user found');
			}
		});
	})

	router.route('/users/:userId')
		.get((req, res) => {
			res.json(req.foundUser);
		})
		.patch((req, res) => {
			console.log(req.foundUser);
			if (req.body._id) delete req.body._id;

			for(let key in req.body) {
				req.foundUser[key] = req.body[key];
			}

			req.foundUser.save(err => {
				if (err) {
					res.status(500).send(err)
				} else {
					res.json(req.foundUser)
				}
			});
		})

	return router;
}

module.exports = routes;