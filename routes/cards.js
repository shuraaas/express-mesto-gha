import { Router } from 'express';
import {
  getCards,
  createCard,
  deleteCard,
  putCardLike,
  deleteCardLike,
} from '../controllers/cards.js';
import { validateCardBody } from '../middlewares/validation.js';

const router = Router();

router.get('/', getCards);
router.post('/', validateCardBody, createCard);
router.delete('/:cardId', deleteCard);
router.put('/:cardId/likes', putCardLike);
router.delete('/:cardId/likes', deleteCardLike);

export { router };
