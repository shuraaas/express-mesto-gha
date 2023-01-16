import jwt from 'jsonwebtoken';
import { SERVER_ERROR, JWT_SECRET_KEY } from '../utils/constants.js';

const auth = (req, res, next) => {

  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).send({ message: 'Необходима авторизация' });
  }

  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET_KEY);
  } catch (err) {
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).send({ message: 'С токеном что-то не так' });
    }
    return res.status(500).send({ message: SERVER_ERROR });
  }

  req.user = payload;
  next();
};

export { auth };
