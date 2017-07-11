import { Request } from 'express';
import { User } from './models/userModel';

export interface RequestWithUser extends Request {
  user: User
}
