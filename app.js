import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';

// роуты
import { router as userRouter } from './routes/users.js ';
import { router as cardRouter } from './routes/cards.js ';

const { PORT = 3000, BASE_PATH } = process.env;
const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(bodyParser.json());
app.use((req, res, next) => {
  req.user = {
    _id: '636fa80e7081e161d24a6a4c'
  };

  next();
});

app.use('/users', userRouter);
app.use('/cards', cardRouter);

app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
})