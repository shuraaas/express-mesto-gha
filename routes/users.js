import { Router } from 'express';
import {
  getUsers,
  getUserById,
  getCurrentUser,
  updateUserProfile,
  updateUserAvatar,
} from '../controllers/users.js';

const router = Router();

router.get('/', getUsers);
router.get('/me', getCurrentUser)
router.get('/:userId', getUserById);
router.patch('/me', updateUserProfile);
router.patch('/me/avatar', updateUserAvatar);

export { router };
