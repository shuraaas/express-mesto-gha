import { constants } from 'http2';
import { User } from '../models/user.js';

const responseBadRequestError = (res, message) => {
  res
    .status(constants.HTTP_STATUS_BAD_REQUEST)
    .send({
      message: `Некорректные данные пользователя. ${message}`,
    });
};

const responseServerError = (res, message) => {
  res
    .status(constants.HTTP_STATUS_BAD_REQUEST)
    .send({
      message: `На сервере произошла ошибка. ${message}`,
    });
};

export const getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      res.send(users);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        responseBadRequestError(res, err.message);
      } else {
        responseServerError(res, err.message);
      }
    });
};

export const getUserById = (req, res) => {
  // res.send(req.user._id)

  User.findById(req.user._id)
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidatorError') {
        responseBadRequestError(res, err.message);
      } else {
        responseServerError(res, err.message);
      }
    });
};

export const createUser = (req, res) => {
  User.create(req.body)
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidatorError') {
        responseBadRequestError(res, err.message);
      } else {
        responseServerError(res, err.message);
      }
    });
};