import { Router } from 'express';
import {
  getCards,
  createCadrd,
  deleteCard,
  putCardLike,
  deleteCardLike,
} from '../controllers/cards.js';

export const router = Router();

router.get('/', getCards);
router.post('/', createCadrd);
router.delete('/:cardId', deleteCard);
router.put('/:cardId/likes', putCardLike);
router.delete('/:cardId/likes', deleteCardLike);