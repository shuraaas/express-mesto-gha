import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import { router as userRouter } from './routes/users.js';
import { router as cardRouter } from './routes/cards.js';

const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(bodyParser.json());
app.use((req, res, next) => {
  // ! Хардкод для тестов
  req.user = {
    _id: '636fa80e7081e161d24a6a4c',
  };

  // псевдоавторизация
  if (req.headers['Authorization'] || req.headers['authorization']) {
    req.user._id = req.headers['Authorization'] || req.headers['authorization'];
  }

  next();
});

app.use('/users', userRouter);
app.use('/cards', cardRouter);

app.listen(PORT, () => {
  console.log(`Server run on http://localhost:${PORT}/`);
});