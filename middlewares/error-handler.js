import { constants } from 'http2';

const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const { message } = err;

  if (statusCode !== 500) {
    res.status(statusCode).send({ message });
  } else {
    res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Ошибка на сервере' });
    console.error(err);
  }
  next();
};

export { errorHandler };
