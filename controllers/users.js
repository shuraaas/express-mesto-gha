import { constants } from 'http2';
import { User } from '../models/user.js';

// TODO: Нужно сделать обработку ошибок по заданию
// для пользователя может быть:
// 400 — Переданы некорректные данные при создании пользователя.
// 400 — Переданы некорректные данные при обновлении профиля.
// 400 — Переданы некорректные данные при обновлении аватара.

// 404 — Пользователь по указанному _id не найден.
// 404 — Пользователь с указанным _id не найден.

// 500 — Ошибка по умолчанию.

const responseBadRequestError = (res, message) => {
  res
    .status(constants.HTTP_STATUS_BAD_REQUEST)
    .send({
      message: `Некорректные данные пользователя. ${message}`,
    });
};

const responseServerError = (res, message) => {
  res
    .status(constants.HTTP_STATUS_SERVICE_UNAVAILABLE)
    .send({
      message: `На сервере произошла ошибка. ${message}`,
    });
};

export const getUsers = (req, res) => {

  res.send(constants)

  // User.find({})
  //   .then((users) => {
  //     res.send(users);
  //   })
  //   .catch((err) => {
  //     if (err.name === 'CastError') {
  //       responseBadRequestError(res, err.message);
  //     } else {
  //       responseServerError(res, err.message);
  //     }
  //   });
};

export const getUserById = (req, res) => {
  User.findById(req.user._id)
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
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
      if (err.name === 'ValidationError') {
        responseBadRequestError(res, err.message);
      } else {
        responseServerError(res, err.message);
      }
    });
};

export const updateUserProfile = (req, res) => {
  User.findByIdAndUpdate(
    req.user._id,
    {
      name: 'Виктор Гусев',
    },
    {
      new: true,
      runValidators: true,
      upsert: true,
    })
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

// TODO: проверить как работает
export const updateUserAvatar = (req, res) => {
  User.findByIdAndUpdate(
    req.user._id,
    {
      avatar: 'https://sobakovod.club',
    },
    {
      new: true,
      runValidators: true,
      upsert: true,
    })
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