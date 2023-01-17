const errorHandler = (err, req, res, next) => {

  // console.log(err.message);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'На сервере произошла ошибка';

  res.status(statusCode).send({ message: message });

  next();

};

export { errorHandler };