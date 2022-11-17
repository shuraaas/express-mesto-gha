import { constants } from 'http2';
import { Card } from '../models/card.js';
import {
  cardBadRequest,
  serverError,
  cardNotFound,
} from '../utils/constants.js';

const responseBadRequestError = (res, message) => res
  .status(constants.HTTP_STATUS_BAD_REQUEST)
  .send({
    message: `${cardBadRequest} ${message}`,
  });

const responseServerError = (res) => res
  .status(constants.HTTP_STATUS_SERVICE_UNAVAILABLE)
  .send({
    message: serverError,
  });

const responseNotFoundError = (res, message) => res
  .status(constants.HTTP_STATUS_NOT_FOUND)
  .send({
    message: `${cardNotFound} ${message}`,
  });

const getCards = (req, res) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((cards) => {
      res.send(cards);
    })
    .catch((err) => {
      responseServerError(res);
      console.log(`${serverError} ${err.message}`);
    });
};

const createCard = (req, res) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => {
      res.send(card);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        responseBadRequestError(res, err.message);
      } else {
        responseServerError(res);
        console.log(`${serverError} ${err.message}`);
      }
    });
};

const deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) {
        responseNotFoundError(res, 404);
      } else {
        res.send(card);
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

const putCardLike = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    {
      new: true,
      runValidators: true,
    },
  )
    .populate(['owner', 'likes'])
    .then((card) => {
      if (!card) {
        responseNotFoundError(res, 404);
      } else {
        res.send(card);
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        responseNotFoundError(res, err.message);
      } else if (err.name === 'CastError') {
        responseBadRequestError(res, err.message);
      } else {
        responseServerError(res);
        console.log(`${serverError} ${err.message}`);
      }
    });
};

const deleteCardLike = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    {
      new: true,
      runValidators: true,
    },
  )
    .populate('owner')
    .then((card) => {
      if (!card) {
        responseNotFoundError(res, 404);
      } else {
        res.send(card);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        responseBadRequestError(res, err.message);
      } else if (err.name === 'ValidationError') {
        responseNotFoundError(res, err.message);
      } else {
        responseServerError(res);
        console.log(`${serverError} ${err.message}`);
      }
    });
};

export {
  getCards,
  createCard,
  deleteCard,
  putCardLike,
  deleteCardLike,
};
