import jwt from 'jsonwebtoken';
import { JWT_SECRET_KEY } from './constants.js';

const generateToken = (payload) => jwt.sign(payload, JWT_SECRET_KEY, { expiresIn: '7d' });

export { generateToken };
