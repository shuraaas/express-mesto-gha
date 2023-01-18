import { Router } from 'express';
import {
  getUsers,
  getUserById,
  getCurrentUser,
  updateUserProfile,
  updateUserAvatar,
} from '../controllers/users.js';
import { validateAvatarBody } from '../middlewares/validation.js';

const router = Router();

router.get('/', getUsers);
router.get('/me', getCurrentUser);
router.get('/:userId', getUserById);
router.patch('/me', updateUserProfile);
router.patch('/me/avatar', validateAvatarBody, updateUserAvatar);

export { router };
