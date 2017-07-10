const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');

const UserSchema = new Schema({
	email: {
		type: String,
		lowercase: true,
		unique: true,
		required: true
	},
	password: {
		type: String,
		select: false,
		required: true
	},
	role: {
		type: String,
		enum: ['member', 'admin'],
		default: 'member'
	},
	profile: {
		displayName: {
			type: String
		},
		age: {
			type: Number
		}
	},
	resetPasswordToken: { 
		type: String 
	},
	resetPasswordExpires: { 
		type: Date 
	}
}, {timestamps: true});

UserSchema.pre('save', function(next) {
	const user = this;
	const SALT_FACTOR = 5;

	if (!user.isModified('password')) {
		return next();
	}

	bcrypt.genSalt(SALT_FACTOR, (err, salt) => {
		if (err) {
			return next(err);
		}

		bcrypt.hash(user.password, salt, (err, hash) => {
			if (err) return next(err);
			
			user.password = hash;
			next();
		});
	});
});

UserSchema.methods.comparePasswords = function(candidatePassword, done) {
	bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
		if (err) return done(err);

		done(null, isMatch);
	})
}

module.exports = mongoose.model('User', UserSchema);