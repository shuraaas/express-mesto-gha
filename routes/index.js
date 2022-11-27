import { Router } from 'express';
import { constants } from 'http2';
import { pageNotFound } from '../utils/constants.js';
import { router as userRouter } from './users.js';
import { router as cardRouter } from './cards.js';
import {
  login,
  createUser,
} from '../controllers/users.js';

const router = Router();

router.post('/signin', login);
router.post('/signup', createUser);

router.use('/users', userRouter);
router.use('/cards', cardRouter);
router.use('*', (req, res) => res
  .status(constants.HTTP_STATUS_NOT_FOUND)
  .send({ message: pageNotFound }));

export { router };
