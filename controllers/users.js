import { constants } from 'http2';
import { User } from '../models/user.js';
// import validator from 'validator';
import bcrypt from 'bcryptjs';
import {
  userBadRequest,
  serverError,
  userNotFound,
} from '../utils/constants.js';

const responseBadRequestError = (res, message) => res
  .status(constants.HTTP_STATUS_BAD_REQUEST)
  .send({
    message: `${userBadRequest} ${message}`,
  });

const responseServerError = (res) => res
  .status(constants.HTTP_STATUS_SERVICE_UNAVAILABLE)
  .send({
    message: serverError,
  });

const responseNotFoundError = (res, message) => res
  .status(constants.HTTP_STATUS_NOT_FOUND)
  .send({
    message: `${userNotFound} ${message}`,
  });

const getUsers = (req, res) => {

  // TODO: вот эту хрень как-то надо использовать
  // validator.isEmail('foo@bar.com')

  User.find({})
    .then((users) => {
      res.send(users);
    })
    .catch((err) => {
      responseServerError(res);
      console.log(`${serverError} ${err.message}`);
    });
};

const getUserById = (req, res) => {
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
        responseServerError(res);
        console.log(`${serverError} ${err.message}`);
      }
    });
};

const createUser = (req, res) => {

  // res.send(req.body)

  bcrypt.hash(req.body.password, 10)
    .then(hash => User.create({ ...req.body, password: hash})
      .then((user) => {
        res.send(user);
      })
      .catch((err) => {
        if (err.name === 'ValidationError') {
          responseBadRequestError(res, err.message);
        } else {
          responseServerError(res);
          console.log(`${serverError} ${err.message}`);
        }
      })
    );
};

const updateUserProfile = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => {
      if (!user) {
        responseNotFoundError(res, 404);
      } else {
        res.send(user);
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        responseBadRequestError(res, err.message);
      } else if (err.name === 'CastError') {
        responseNotFoundError(res, err.message);
      } else {
        responseServerError(res);
        console.log(`${serverError} ${err.message}`);
      }
    });
};

const updateUserAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => {
      if (!user) {
        responseNotFoundError(res, 404);
      } else {
        res.send(user);
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        responseBadRequestError(res, err.message);
      } else if (err.name === 'CastError') {
        responseNotFoundError(res, err.message);
      } else {
        responseServerError(res);
        console.log(`${serverError} ${err.message}`);
      }
    });
};

export {
  getUsers,
  getUserById,
  createUser,
  updateUserProfile,
  updateUserAvatar,
};
