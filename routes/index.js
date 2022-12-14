import { Router } from 'express';
import { constants } from 'http2';
import { pageNotFound } from '../utils/constants.js';
import { router as userRouter } from './users.js';
import { router as cardRouter } from './cards.js';

const router = Router();

router.use('/users', userRouter);
router.use('/cards', cardRouter);
router.use('*', (req, res) => res
  .status(constants.HTTP_STATUS_NOT_FOUND)
  .send({ message: pageNotFound }));

export { router };
