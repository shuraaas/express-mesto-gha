import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import { router } from './routes/index.js';

const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb');
app.use(bodyParser.json());

// app.use((req, res, next) => {
//   req.user = {
//     _id: '636fa80e7081e161d24a6a4c',
//   };

//   if (req.headers.authorization) {
//     req.user._id = req.headers.authorization;
//   }

//   next();
// });

app.use(router);
app.listen(PORT, () => {
  console.log(`Server run on http://localhost:${PORT}/`);
});
