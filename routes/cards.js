import { Router } from 'express';
import {
  getCards,
  createCard,
  deleteCard,
  putCardLike,
  deleteCardLike,
} from '../controllers/cards.js';

const router = Router();

router.get('/', getCards);
router.post('/', createCard);
router.delete('/:cardId', deleteCard);
router.put('/:cardId/likes', putCardLike);
router.delete('/:cardId/likes', deleteCardLike);

export { router };
