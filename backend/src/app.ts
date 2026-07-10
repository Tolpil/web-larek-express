import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import path from 'path';
import productRouter from './routes/product';
import orderRouter from './routes/order';

const { PORT = 3000, DB_ADDRESS = 'mongodb://127.0.0.1:27017/weblarek' } = process.env;

const app = express();

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

app.use(productRouter);
app.use(orderRouter);

mongoose.connect(DB_ADDRESS).then(() => {
  console.log('Connected to MongoDB');
  app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
  });
});