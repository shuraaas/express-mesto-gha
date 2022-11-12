import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';

// роуты
import { router as userRouter } from './routes/users.js ';
import { router as cardRouter } from './routes/users.js ';

const { PORT = 3000, BASE_PATH } = process.env;
const app = express();

app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use('/users', userRouter);
app.use('/cards', cardRouter);

app.use((req, res, next) => {
  req.user = {
    _id: '636f8cf0a3a2b40012c3720a'
  };

  next();
});

app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
})