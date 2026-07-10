import { Request, Response } from 'express';
import Product from '../models/product';

export const getProducts = async (_req: Request, res: Response) => {
  try {
    const products = await Product.find();
    return res.status(200).json({ items: products, total: products.length });
  } catch (err) {
    return res.status(500).json({ message: 'Ошибка при получении товаров' });
  }
};

export const createProduct = async (req: Request, res: Response) => {
  try {
    const { title, image, category, description, price } = req.body;
    const product = await Product.create({ title, image, category, description, price });
    return res.status(201).json(product);
  } catch (err) {
    return res.status(400).json({ message: 'Ошибка при создании товара' });
  }
};