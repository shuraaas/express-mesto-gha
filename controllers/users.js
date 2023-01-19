import bcrypt from 'bcryptjs';
import { User } from '../models/user.js';
import { generateToken } from '../utils/jwt.js';
import {
  MONGO_DUPLICATE_ERROR_CODE,
  SOLT_ROUNDS,
} from '../utils/constants.js';
import {
  BadRequestErr,
  MongoDuplicateErr,
} from '../errors/index.js';

const registerUser = async (req, res, next) => {
  const { password } = req.body;
  try {
    const hash = await bcrypt.hash(password, SOLT_ROUNDS);
    const newUser = await User.create({ ...req.body, password: hash });
    if (newUser) {
      res.send({
        _id: newUser._id,
        email: newUser.email,
        name: newUser.name,
        about: newUser.about,
        avatar: newUser.avatar,
      });
    }
  } catch (err) {
    if (err.name === 'ValidationError') {
      next(new BadRequestErr('Не валидный email или password'));
    } else if (err.code === MONGO_DUPLICATE_ERROR_CODE) {
      next(new MongoDuplicateErr('Такой пользователь уже существует'));
    } else {
      next(err);
    }
  }
};

const authUser = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await User.findUserByCredentials({ email, password });
    const token = generateToken({ _id: user._id });
    res.send({ token });
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

const getCurrentUser = async (req, res, next) => {
  try {
    const currentUser = await User.findById(req.user._id);
    res.send(currentUser);
  } catch (err) {
    next(err);
  }
};

const getUserById = async (req, res, next) => {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId);
    res.send(user);
  } catch (err) {
    if (err.name === 'CastError') {
      next(new BadRequestErr('Не валидный ID'));
    } else {
      next(err);
    }
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
    res.send(updatedUser);
  } catch (err) {
    if (err.name === 'ValidationError') {
      next(new BadRequestErr('Что-то не так с данными'));
    } else {
      next(err);
    }
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
    res.send(updatedUser);
  } catch (err) {
    if (err.name === 'ValidationError') {
      next(new BadRequestErr('Что-то не так с данными'));
    } else {
      next(err);
    }
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
