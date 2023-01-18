const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'На сервере произошла ошибка';

  res.status(statusCode).send({ message });
  next();
};

export { errorHandler };
