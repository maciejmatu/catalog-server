import { Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import * as nodemailer from 'nodemailer';
import * as crypto from 'crypto';

import User, { IUser } from '../models/userModel';
import config from '../config';

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

	res.status(201)
    .json({
      token: `JWT ${generateToken(userInfo)}`,
      user: userInfo
    });
}

export const login = (req, res, next) => {
  respondWithToken(req.user, res);
}

export const register = (req, res, next) => {
  const { email, password, displayName } = req.body;

	if (!email || !password) {
		res.status(422).send({ error: 'Email and password are required.' });
	} else {
    User.findOne({ email })
      .then(existingUser => {
        if (existingUser) {
          return res.status(422).send({ error: 'That email address is already in use.' });
        }

        let user = new User({
          email,
          password,
          profile: {
            displayName: displayName
          }
        });

        return user.save();
      })
      .then(user => res.status(201).send('User created'))
      .catch(err => next(err));
  }
}

export const requireRole = (requiredRole) => {
	return (req, res, next) => {

    User.findById(req.user._id)
      .then(foundUser => {
        if (foundUser.role === requiredRole) {
          return next();
        } else {
          return res.status(401).json({ error: 'You are not authorized to view this content.' });
        }
      })
      .catch(err => {
        res.status(422).json({ error: 'No user was found.' })
        return next(err);
      });
	}
}

export const forgotPassword = (req, res, next) => {
  let transporter;
  const { email } = req.body;

  User.findOne({ email })
    .then(foundUser => {
      if (!foundUser) return Promise.reject('No such user');

      const resetToken = crypto.randomBytes(48).toString('hex');

      foundUser.resetPasswordToken = resetToken;
      foundUser.resetPasswordExpires = Date.now() + 3600000; // 1 hour

      return foundUser.save();
    })
    .then((savedUser: IUser) => {
      if (!config.SMTPS) return Promise.reject('Unable to send email');

      transporter = nodemailer.createTransport(config.SMTPS);

      return transporter.sendMail({
        from: '"Maciej from Catalog"',
        to: email,
        subject: 'Catalog App - Reset Password',
        text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n` +
          `Please click on the following link, or paste this into your browser to complete the process:\n\n` +
          `http://${config.clientURL}/reset-password/${savedUser.resetPasswordToken} \n\n` +
          'If you did not request this, please ignore this email and your password will remain unchanged.\n' +
          `Reset password link will be active for one hour`
      })
    })
    .then(() => {
      transporter.close();
      return res.status(200).json({ message: 'Please check your email for the link to reset your password.' });
    })
    .catch(err => {
      res.status(422)
        .json({ error: 'Your request could not be processed as entered. Please try again.' });
        return next(err);
    })
}

export const verifyPasswordResetToken = (req, res, next) => {
  let transporter;
  const query = {
    resetPasswordToken: req.body.passwordResetToken,
		resetPasswordExpires: {
			$gt: Date.now()
		}
  }

  User.findOne(query)
    .select('+password')
    .then(foundUser => {
      if (!foundUser) return Promise.reject('No such user');

      foundUser.password = req.body.password;
      foundUser.resetPasswordToken = undefined;
      foundUser.resetPasswordExpires = undefined;

      return foundUser.save()
    })
    .then((savedUser: IUser) => {
      if (!config.SMTPS) return Promise.reject('Unable to send email');

      transporter = nodemailer.createTransport(config.SMTPS);

      return transporter.sendMail({
        from: '"Maciej from Catalog"',
        to: savedUser.email,
        subject: 'Catalog App - Password Changed Notice',
        text: `You are receiving this email because you changed your password.\n\n` +
          `If you did not request this change, please contact us immediately.`
      })
    })
    .then(() => {
      transporter.close();
      return res.status(200).json({ message: 'Password changed successfully. Please login with your new password.' });
    })
    .catch((err) => {
      res.status(422).json({ error: 'Your token is incorrect or has expired. Please attempt to reset your password again.' });
      return next(err);
    })
}
