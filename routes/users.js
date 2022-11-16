import { Router } from 'express';
import {
  getUsers,
  getUserById,
  createUser,
  updateUserProfile,
  updateUserAvatar,
} from '../controllers/users.js';

export const router = Router();

router.get('/', getUsers);
router.get('/:userId', getUserById);
router.post('/', createUser);
router.patch('/me', updateUserProfile);
router.patch('/me/avatar', updateUserAvatar);
