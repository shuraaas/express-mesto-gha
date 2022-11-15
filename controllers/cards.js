import { constants } from 'http2';
import { Card } from '../models/card.js';

const responseBadRequestError = (res, message) => res
  .status(constants.HTTP_STATUS_BAD_REQUEST)
  .send({
    message: `Переданы некорректные данные карточки. ${message}`,
  });

const responseServerError = (res, message) => res
  .status(constants.HTTP_STATUS_SERVICE_UNAVAILABLE)
  .send({
    message: `На сервере произошла ошибка. ${message}`,
  });

const responseNotFoundError = (res, message) => res
  .status(constants.HTTP_STATUS_NOT_FOUND)
  .send({
    message: `Карточка с указанным _id не найдена. ${message}`,
  });

export const getCards = (req, res) => {
  Card.find({})
    .then((cards) => {
      res.send(cards);
    })
    .catch((err) => {
      responseServerError(res, err.message);
    });
};

export const createCard = (req, res) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((cards) => {
      res.send(cards);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        responseBadRequestError(res, err.message);
      } else {
        responseServerError(res, err.message);
      }
    });
};

export const deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        responseNotFoundError(res, err.message);
      } else {
        responseServerError(res, err.message);
      }
    });
};

export const putCardLike = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      res.send(card);
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

export const deleteCardLike = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      res.send(card);
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