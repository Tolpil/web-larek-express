import { Request, Response, NextFunction } from 'express';
import { Error as MongooseError } from 'mongoose';

interface AppError extends Error {
  statusCode?: number;
}

export default (err: AppError, _req: Request, res: Response, _next: NextFunction) => {
  const { statusCode = 500, message } = err;

  if (err instanceof MongooseError.ValidationError) {
    return res.status(400).json({ message: 'Ошибка валидации данных при создании товара' });
  }

  if (err instanceof Error && err.message.includes('E11000')) {
    return res.status(409).json({ message: 'Товар с таким названием уже существует' });
  }

  res.status(statusCode).json({
    message: statusCode === 500 ? 'Ошибка сервера' : message,
  });
};