import jwt from 'jsonwebtoken';
import { JWT_SECRET_KEY } from '../utils/constants.js';
import { UnAuthtorizedErr } from '../errors/index.js';

const auth = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    throw new UnAuthtorizedErr('Необходима авторизация');
  }

  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET_KEY);
  } catch (err) {
    if (err.name === 'JsonWebTokenError') {
      next(new UnAuthtorizedErr('Необходима авторизация'));
    } else {
      next(err);
    }
  }

  req.user = payload;
  next();
};

export { auth };
