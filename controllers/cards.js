// module.exports.createCard = (req, res) => {
//   console.log(req.user._id); // _id станет доступен
// }

import { constants } from 'http2';
import { Card } from '../models/card.js';

const responseBadRequestError = (res, message) => {
  res
    .status(constants.HTTP_STATUS_BAD_REQUEST)
    .send({
      message: `Некорректные данные пользователя. ${message}`,
    });
};

const responseServerError = (res, message) => {
  res
    .status(constants.HTTP_STATUS_BAD_REQUEST)
    .send({
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
  Card.create(req.body)
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

};