import { Request, Response, NextFunction } from 'express';
import { faker } from '@faker-js/faker';
import Product from '../models/product';
import { BadRequestError } from '../errors';

export const createOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { payment, email, phone, address, total, items } = req.body;

    if (!payment || !email || !phone || !address || total === undefined || !items) {
      throw new BadRequestError('Все поля обязательны');
    }

    if (payment !== 'card' && payment !== 'online') {
      throw new BadRequestError('payment должен быть card или online');
    }

    if (!Array.isArray(items) || items.length === 0) {
      throw new BadRequestError('items должен быть непустым массивом');
    }

    const products = await Product.find({ _id: { $in: items } });

    if (products.length !== items.length) {
      throw new BadRequestError('Некоторые товары не найдены в базе');
    }

    const hasNullPrice = products.some((product) => product.price === null || product.price === undefined);
    if (hasNullPrice) {
      throw new BadRequestError('Нельзя заказать товар без цены');
    }

    const calculatedTotal = products.reduce((sum, product) => sum + (product.price || 0), 0);
    if (calculatedTotal !== total) {
      throw new BadRequestError('total не совпадает с суммой товаров');
    }

    const id = faker.string.uuid();

    return res.status(201).json({ id, total });
  } catch (err) {
    return next(err);
  }
};