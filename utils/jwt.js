import jwt from 'jsonwebtoken';

const JWT_SECRET_KEY = 'secret_key';

const generateToken = (payload) => {
  return jwt.sign(payload, 'secret_key', { expiresIn: '7d' });
};

export { generateToken };