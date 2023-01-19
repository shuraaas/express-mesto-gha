import jwt from 'jsonwebtoken';
import { JWT_SECRET_KEY } from '../utils/constants.js';
import { UnAuthtorizedErr } from '../errors/index.js';

const auth = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    return next(new UnAuthtorizedErr('Необходима авторизация'));
  }

  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(token, JWT_SECRET_KEY);
  } catch (err) {
    if (err.name === 'JsonWebTokenError') {
      return next(new UnAuthtorizedErr('Необходима авторизация'));
    }
    return next(err);
  }

  req.user = payload;
  next();
};

export { auth };
