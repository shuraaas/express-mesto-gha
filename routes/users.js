import { Router } from 'express';
import {
  getUsers,
  getUserById,
  createUser
} from '../controllers/users.js';

export const router = Router();

router.get('/', getUsers);
router.get('/:userId', getUserById);
router.post('/', createUser);