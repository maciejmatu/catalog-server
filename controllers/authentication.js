const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const config = require('../config/main');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

const generateToken = (userInfo) => {
	return jwt.sign(userInfo, config.secret, {
		expiresIn: 3600
	})
};

const respondWithToken = (user, res) => {
	const userInfo = {
		_id: user.id,
		displayName: user.profile.displayName,
		email: user.email,
		role: user.role
	}

	res.status(201).json({
		token: `JWT ${generateToken(userInfo)}`,
  		user: userInfo
	})
}

exports.login = (req, res, next) => {
	respondWithToken(req.user, res);
}

exports.register = (req, res, next) => {
	const email = req.body.email;
	const password = req.body.password;

	if (!email || !password) {
		res.status(422).send({error: 'Email and password are required.'});
	} else {
		User.findOne({email: email}, (err, existingUser) => {
			if (err) return next(err);

			if (existingUser) {
				return res.status(422).send({error: 'That email address is already in use.'})
			}

			// if email is unique and email and password was provided
			let user = new User({
				email: email,
				password: password,
				profile: {
					displayName: req.body.displayName,
					age: req.body.age
				}
			});
			
			user.save((err, user) => {
				if (err) return next(err);
				
				respondWithToken(user, res);
			})
		})
	}
}

exports.requireRole = (requiredRole) => {
	return (req, res, next) => {
		const user = req.user;

		User.findById(user._id, (err, foundUser) => {
			if (err) {
				res.status(422).json({ error: 'No user was found.' });
				return next(err);
			}

			// If user is found, check role.
			if (foundUser.role == requiredRole) {
				return next();
			}

			return res.status(401).json({ error: 'You are not authorized to view this content.' });
		});
	}
}

exports.forgotPassword = (req, res, next) => {
	const email = req.body.email;

	User.findOne({ email }, (err, existingUser) => {
		if (err || existingUser == null) {
      		res.status(422).json({ error: 'Your request could not be processed as entered. Please try again.' });
      		return next(err);
  		}

		// Generate a token with Crypto
		crypto.randomBytes(48, (err, buffer) => {
			const resetToken = buffer.toString('hex');
			if (err) { return next(err); }

			existingUser.resetPasswordToken = resetToken;
			existingUser.resetPasswordExpires = Date.now() + 3600000; // 1 hour

			existingUser.save(err => {
				if (err) { return next(err); }

				const transporter = nodemailer.createTransport('smtps://mat.gry10%40gmail.com:lustereczko@smtp.gmail.com');

				const mailOptions = {
					from: '"Maciej from Catalog" <noreply@catalog.com>', // sender address 
					to: email, // list of receivers 
					subject: 'Reset Password', // Subject line 
					text: `${'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
						'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
						'http://'}${req.headers.host}/api/reset-password/${resetToken}\n\n` +
						`If you did not request this, please ignore this email and your password will remain unchanged.\n` +
						`Reset password link will be active for one hour`
				};
				
				transporter.sendMail(mailOptions, (error, info) => {
					if(error){ return console.log(error);}
					transporter.close();
					return res.status(200).json({ message: 'Please check your email for the link to reset your password.' });
				});
			})
		});
	});
}

exports.verifyToken = (req, res, next) => {
	var query = {
		resetPasswordToken: req.params.token,
		resetPasswordExpires: { 
			$gt: Date.now() 
		} 
	}

	console.log(req.params.token);

	User.findOne(query).select('+password').then(resetUser => {
		// If query returned no results, token expired or was invalid. Return error.
		if (!resetUser) {
			res.status(422).json({ error: 'Your token has expired. Please attempt to reset your password again.' });
		}
		
		// Otherwise, save new password and clear resetToken from database
		resetUser.password = req.body.password;
		resetUser.resetPasswordToken = undefined;
		resetUser.resetPasswordExpires = undefined;

    	resetUser.save((err) => {
      		if (err) { return next(err); }

			const transporter = nodemailer.createTransport('smtps://mat.gry10%40gmail.com:lustereczko@smtp.gmail.com');

			const mailOptions = {
				from: '"Maciej from Catalog" <noreply@catalog.com>', // sender address 
				to: resetUser.email, // list of receivers 
				subject: 'Password Changed',
				text: 'You are receiving this email because you changed your password. \n\n' +
          			'If you did not request this change, please contact us immediately.'
			};
			
			transporter.sendMail(mailOptions, (error, info) => {
				if(error){ return console.log(error);}
				transporter.close();
				return res.status(200).json({ message: 'Password changed successfully. Please login with your new password.' });
			});
		});
	}, err => {
		res.status(500).json({ error: 'An error occured' });
	});
}