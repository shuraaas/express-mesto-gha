import { Router } from 'express';
import {
  getCards,
  createCadrd,
  deleteCard
} from '../controllers/cards.js';

export const router = Router();

router.get('/', getCards);
router.post('/', createCadrd);
router.delete('/', deleteCard);