import { Card } from '../models/card.js';
import {
  BadRequestErr,
  ForbiddenErr,
  NotFoundError,
} from '../errors/index.js';

const getCards = async (req, res, next) => {
  try {
    const cards = await Card.find({}).populate(['owner', 'likes']);
    res.send(cards);
  } catch (err) {
    next(err);
  }
};

const createCard = async (req, res, next) => {
  try {
    const newCard = await Card.create({ ...req.body, owner: req.user._id });
    res.send(newCard);
  } catch (err) {
    if (err.name === 'ValidationError') {
      next(new BadRequestErr('Что-то не так с данными'));
    } else {
      next(err);
    }
  }
};

const deleteCard = async (req, res, next) => {
  try {
    const card = await Card.findById(req.params.cardId);
    if (!card) {
      return next(new NotFoundError('Карточка с таким ID не найдена'));
    }

    if (card.owner.toString() !== req.user._id) {
      return next(new ForbiddenErr('Нет доступа'));
    }

    await Card.deleteOne(card._id);
    return res.send(card);
  } catch (err) {
    return next(err);
  }
};

const putCardLike = async (req, res, next) => {
  try {
    const updatedCard = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      {
        new: true,
      },
    ).populate(['owner', 'likes']);

    if (!updatedCard) {
      throw new NotFoundError('Карточка не найдена');
    } else {
      res.send(updatedCard);
    }
  } catch (err) {
    if (err.name === 'CastError') {
      next(new BadRequestErr('Что-то не так с данными'));
    } else {
      next(err);
    }
  }
};

const deleteCardLike = async (req, res, next) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      {
        new: true,
      },
    ).populate(['owner', 'likes']);

    if (!card) {
      throw new NotFoundError('Карточка не найдена');
    } else {
      res.send(card);
    }
  } catch (err) {
    if (err.name === 'CastError') {
      next(new BadRequestErr('Что-то не так с данными'));
    } else {
      next(err);
    }
  }
};

export {
  getCards,
  createCard,
  deleteCard,
  putCardLike,
  deleteCardLike,
};
