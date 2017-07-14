import { Document, Schema, model } from 'mongoose';
import * as bcrypt from 'bcryptjs';

export interface IUser extends Document {
  email: string,
  password?: string,
  role: string,
  profile: {
    displayName: string
  },
  resetPasswordToken?: string,
  resetPasswordExpires?: number,
  comparePasswords: Function
}

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
		}
	},
	resetPasswordToken: {
		type: String
	},
	resetPasswordExpires: {
		type: Date
	}
}, { timestamps: true });

UserSchema.pre('save', function (next) {
	const SALT_FACTOR = 5;

	if (!this.isModified('password')) return next();

  bcrypt.genSalt(SALT_FACTOR)
    .then(salt => bcrypt.hash(this.password, salt))
    .then(hash => this.password = hash)
    .then(() => next())
    .catch(err => next(err));
});

UserSchema.methods.comparePasswords = function(candidatePassword, done) {
  bcrypt.compare(candidatePassword, this.password)
    .then(isMatch => done(null, isMatch))
    .catch(err => done(err))
}

export default model<IUser>('User', UserSchema);
