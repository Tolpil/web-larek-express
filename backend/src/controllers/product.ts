import { Request, Response, NextFunction } from 'express';
import Product from '../models/product';
import { BadRequestError, ConflictError } from '../errors';

export const getProducts = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const products = await Product.find();
    return res.status(200).json({ items: products, total: products.length });
  } catch (err) {
    return next(err);
  }
};

export const createProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { title, image, category, description, price } = req.body;
    const product = await Product.create({ title, image, category, description, price });
    return res.status(201).json(product);
  } catch (err: any) {
    if (err.name === 'ValidationError') {
      return next(new BadRequestError('Ошибка валидации данных при создании товара'));
    }
    if (err.message?.includes('E11000')) {
      return next(new ConflictError('Товар с таким названием уже существует'));
    }
    return next(err);
  }
};