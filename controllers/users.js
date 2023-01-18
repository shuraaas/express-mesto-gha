import bcrypt from 'bcryptjs';
import { User } from '../models/user.js';
import { generateToken } from '../utils/jwt.js';
import {
  MONGO_DUPLICATE_ERROR_CODE,
  SOLT_ROUNDS,
} from '../utils/constants.js';
import {
  NotFoundError,
  BadRequestErr,
  MongoDuplicateErr,
  UnAuthtorizedErr,
} from '../errors/index.js';

// контроллер регистрации(createUser)
const registerUser = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    next(new BadRequestErr('Не передан email или password'));
  }

  try {
    const hash = await bcrypt.hash(password, SOLT_ROUNDS);
    const newUser = await User.create({ ...req.body, password: hash });
    if (newUser) {
      res.send(newUser);
    }
  } catch (err) {
    if (err.name === 'ValidationError') {
      next(new BadRequestErr('Не валидный email или password'));
    }
    if (err.code === MONGO_DUPLICATE_ERROR_CODE) {
      next(new MongoDuplicateErr('Такой пользователь уже существует'));
    }
    next(err);
  }
};

// контроллер авторизации(login)
const authUser = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    next(new UnAuthtorizedErr('Не правильные email или password'));
  }
  try {
    const user = await User.findUserByCredentials({ email, password });
    let token;
    if (user) {
      token = generateToken({ _id: user._id });
    }
    res.status(200).send({ message: 'Добро пожаловать!', token });
  } catch (err) {
    next(err);
  }
};

const getUsers = async (req, res, next) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (err) {
    next(err);
  }
};

// ? вроде работает, но так ли должно работать?
const getCurrentUser = async (req, res) => {
  const currentUser = await User.findById(req.user._id);
  return res.send(currentUser);
};

const getUserById = async (req, res, next) => {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId);
    if (user) {
      res.send(user);
    } else {
      throw new NotFoundError('Пользователь с указанным ID не найден');
    }
  } catch (err) {
    if (err.name === 'CastError') {
      next(new BadRequestErr('Не валидный ID'));
    }
    next(err);
  }
};

const updateUserProfile = async (req, res, next) => {
  const { name, about } = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { name, about },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!updatedUser) {
      throw new NotFoundError('Пользователь не найден');
    } else {
      res.send(updatedUser);
    }
  } catch (err) {
    if (err.name === 'ValidationError') {
      next(new BadRequestErr('Что-то не так с данными'));
    }

    next(err);
  }
};

const updateUserAvatar = async (req, res, next) => {
  const { avatar } = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { avatar },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!updatedUser) {
      throw new NotFoundError('Пользователь не найден');
    } else {
      res.send(updatedUser);
    }
  } catch (err) {
    if (err.name === 'ValidationError') {
      next(new BadRequestErr('Что-то не так с данными'));
    }

    next(err);
  }
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
