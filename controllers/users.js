import { constants } from 'http2';
import { User } from '../models/user.js';

const responseBadRequestError = (res, message) => res
  .status(constants.HTTP_STATUS_BAD_REQUEST)
  .send({
    message: `Переданы некорректные данные пользователя. ${message}`,
  });

const responseServerError = (res, message) => res
  .status(constants.HTTP_STATUS_SERVICE_UNAVAILABLE)
  .send({
    message: `На сервере произошла ошибка. ${message}`,
  });

const responseNotFoundError = (res, message) => res
  .status(constants.HTTP_STATUS_NOT_FOUND)
  .send({
    message: `Пользователь с указанным _id не найден. ${message}`,
  });

export const getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      res.send(users);
    })
    .catch((err) => {
      responseServerError(res, err.message);
    });
};

export const getUserById = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        responseNotFoundError(res, 404);
      } else {
        res.send(user);
      }
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
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    {
      new: true,
      runValidators: true,
      upsert: true,
    },
  )
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        responseBadRequestError(res, err.message);
      } else if (err.name === 'CastError') {
        responseNotFoundError(res, err.message);
      } else {
        responseServerError(res, err.message);
      }
    });
};

export const updateUserAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    {
      new: true,
      runValidators: true,
      upsert: true,
    },
  )
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        responseBadRequestError(res, err.message);
      } else if (err.name === 'CastError') {
        responseNotFoundError(res, err.message);
      } else {
        responseServerError(res, err.message);
      }
    });
};