import { Router } from 'express';
import {
  getUsers,
  getUserById,
  createUser
} from '../controllers/users.js';

export const router = Router();

router.get('/', getUsers);
router.get('/', getUserById);
router.post('/', createUser);