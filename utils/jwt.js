import jwt from 'jsonwebtoken';
import { JWT_SECRET_KEY } from '../utils/constants.js';

const generateToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET_KEY, { expiresIn: '7d' });
};

export { generateToken };