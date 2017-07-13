import User from '../models/userModel';
import { Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import config from '../config';
import nodemailer from 'nodemailer';

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

        user.save()
          .then(user => res.status(201).send('User created'))
          .catch(err => next(err));
      })
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
