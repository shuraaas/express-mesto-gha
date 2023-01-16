import { constants } from 'http2';
import { User } from '../models/user.js';
// import validator from 'validator';
import bcrypt from 'bcryptjs';
import { generateToken } from '../utils/jwt.js';
import {
  USER_BAD_REQUEST,
  SERVER_ERROR,
  USER_NOT_FOUND,
  MONGO_DUPLICATE_ERROR_CODE,
  SOLT_ROUNDS,
} from '../utils/constants.js';
import { log } from 'console';

const responseBadRequestError = (res, message) => res
  .status(constants.HTTP_STATUS_BAD_REQUEST)
  .send({
    message: `${USER_BAD_REQUEST} ${message}`,
  });

const responseServerError = (res) => res
  .status(constants.HTTP_STATUS_SERVICE_UNAVAILABLE)
  .send({
    message: SERVER_ERROR,
  });

const responseNotFoundError = (res, message) => res
  .status(constants.HTTP_STATUS_NOT_FOUND)
  .send({
    message: `${USER_NOT_FOUND} ${message}`,
  });

// контроллер регистрации(createUser)
const registerUser = async (req, res) => {

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send({ message: 'Не передан email или password' });
  }

  try {

    const hash = await bcrypt.hash(password, SOLT_ROUNDS);

    const newUser = await User.create({ ...req.body, password: hash });
    if (newUser) {
      return res.status(201).send(newUser);
    }

  } catch (err) {

    if (err.name === 'ValidationError') {
      return res.status(400).send({ message: 'Не валидный email или password' });
    }

    if (err.code === MONGO_DUPLICATE_ERROR_CODE) {
      return res.status(409).send({ message: 'Такой пользователь уже существует' });
    }

    return res.status(500).send({ message: 'Не удалось зарегистрировать пользователя' });
  }
};

// контроллер авторизации(login)
const authUser = async (req, res) => {

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(401).send({ message: 'Не правильные email или password' });
  }

  try {

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).send({ message: 'Не правильные email или password' });
    }

    const currentUser = await User.findUserByCredentials({ email, password });
    let token;

    if (currentUser) {
      token = generateToken({ _id: currentUser._id });
    }

    return res.status(200).send({ message: 'Добро пожаловать!', token });

  } catch (err) {
    return res.status(500).send({ message: 'Не удалось авторизоваться' });
  }
};

const getUsers = (req, res) => {

  // TODO: вот эту хрень как-то надо использовать
  // validator.isEmail('foo@bar.com')

  User.find({})
    .then((users) => {
      res.send(users);
    })
    .catch((err) => {
      responseServerError(res);
      console.log(`${SERVER_ERROR} ${err.message}`);
    });
};

// ? вроде работает, но так ли должно работать?
const getCurrentUser = async (req, res) => {
  const currentUser = await User.findById(req.user._id);
  return res.send(currentUser);
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
        console.log(`${SERVER_ERROR} ${err.message}`);
      }
    });
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
        console.log(`${SERVER_ERROR} ${err.message}`);
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
        console.log(`${SERVER_ERROR} ${err.message}`);
      }
    });
};

export {
  authUser,
  getUsers,
  getUserById,
  registerUser,
  getCurrentUser,
  updateUserProfile,
  updateUserAvatar,
};
