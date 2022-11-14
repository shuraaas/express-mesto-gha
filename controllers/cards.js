import { constants } from 'http2';
import { Card } from '../models/card.js';

// TODO: Нужно сделать обработку ошибок по заданию
// для карточек может быть:
// 400 — Переданы некорректные данные при создании карточки.
// 400 — Переданы некорректные данные для постановки/снятии лайка.

// 404 — Карточка с указанным _id не найдена.
// 404 — Передан несуществующий _id карточки.

// 500 — Ошибка по умолчанию.

const responseBadRequestError = (res, message) => {
  res
    .status(constants.HTTP_STATUS_BAD_REQUEST)
    .send({
      // TODO: тут надо пометять текст
      message: `Некорректные данные пользователя. ${message}`,
    });
};

const responseServerError = (res, message) => {
  res
    .status(constants.HTTP_STATUS_BAD_REQUEST)
    .send({
      // TODO: тут надо пометять текст
      message: `На сервере произошла ошибка. ${message}`,
    });
};

export const getCards = (req, res) => {
  Card.find({})
    .then((cards) => {
      res.send(cards);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        responseBadRequestError(res, err.message);
      } else {
        responseServerError(res, err.message);
      }
    });
};

export const createCadrd = (req, res) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((cards) => {
      res.send(cards);
    })
    .catch((err) => {
      if (err.name === 'ValidatorError') {
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
      if (err.name === 'ValidatorError') {
        responseBadRequestError(res, err.message);
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
      if (err.name === 'ValidatorError') {
        responseBadRequestError(res, err.message);
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
      if (err.name === 'ValidatorError') {
        responseBadRequestError(res, err.message);
      } else {
        responseServerError(res, err.message);
      }
    });
};