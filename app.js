import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import { errors } from 'celebrate';
import { router } from './routes/index.js';
import { errorHandler } from './middlewares/error-handler.js';

const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb');
app.use(bodyParser.json());
app.use(router);

app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => console.log(`Server run on http://localhost:${PORT}/`));
