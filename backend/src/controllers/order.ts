import { Request, Response } from 'express';
import { faker } from '@faker-js/faker';
import Product from '../models/product';

export const createOrder = async (req: Request, res: Response) => {
  try {
    const { payment, email, phone, address, total, items } = req.body;

    if (!payment || !email || !phone || !address || total === undefined || !items) {
      return res.status(400).json({ message: 'Все поля обязательны' });
    }

    if (payment !== 'card' && payment !== 'online') {
      return res.status(400).json({ message: 'payment должен быть card или online' });
    }

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'items должен быть непустым массивом' });
    }

    const products = await Product.find({ _id: { $in: items } });

    if (products.length !== items.length) {
      return res.status(400).json({ message: 'Некоторые товары не найдены в базе' });
    }

    const hasNullPrice = products.some((product) => product.price === null || product.price === undefined);
    if (hasNullPrice) {
      return res.status(400).json({ message: 'Нельзя заказать товар без цены' });
    }

    const calculatedTotal = products.reduce((sum, product) => sum + (product.price || 0), 0);
    if (calculatedTotal !== total) {
      return res.status(400).json({ message: 'total не совпадает с суммой товаров' });
    }

    const id = faker.string.uuid();

    return res.status(201).json({ id, total });
  } catch (err) {
    return res.status(500).json({ message: 'Ошибка при создании заказа' });
  }
};