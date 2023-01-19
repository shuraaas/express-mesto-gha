import { Router } from 'express';
import {
  getCards,
  createCard,
  deleteCard,
  putCardLike,
  deleteCardLike,
} from '../controllers/cards.js';
import {
  validateCardBody,
  validateCardId,
} from '../middlewares/validation.js';

const router = Router();

router.get('/', getCards);
router.post('/', validateCardBody, createCard);
router.delete('/:cardId', validateCardId, deleteCard);
router.put('/:cardId/likes', validateCardId, putCardLike);
router.delete('/:cardId/likes', validateCardId, deleteCardLike);

export { router };
