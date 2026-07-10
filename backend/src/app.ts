import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import path from 'path';
import cookieParser from 'cookie-parser';
import { errors } from 'celebrate';
import productRouter from './routes/product';
import orderRouter from './routes/order';
import authRouter from './routes/auth';
import uploadRouter from './routes/upload';
import { requestLogger, errorLogger } from './middlewares/logger';
import errorHandler from './middlewares/error-handler';
import { NotFoundError } from './errors';
import { PORT, DB_ADDRESS, ORIGIN_ALLOW } from './config';

const app = express();

app.use(cors({
  origin: ORIGIN_ALLOW,
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

app.use(requestLogger);

app.use(express.static(path.join(__dirname, '..', 'public')));

app.use('/upload', uploadRouter);
app.use(productRouter);
app.use(orderRouter);
app.use(authRouter);

app.use(errors());
app.use(errorLogger);

app.use((_req, _res, next) => next(new NotFoundError('Маршрут не найден')));

app.use(errorHandler);

mongoose.connect(DB_ADDRESS).then(() => {
  console.log('Connected to MongoDB');
  app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
  });
});