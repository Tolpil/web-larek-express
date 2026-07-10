import path from 'path';
import fs from 'fs';
import { Request, Response, NextFunction } from 'express';
import Product from '../models/product';
import { BadRequestError, ConflictError, NotFoundError } from '../errors';
import { UPLOAD_PATH, UPLOAD_PATH_TEMP } from '../config';

const moveFileFromTemp = (fileName: string): void => {
  const tempDir = path.join(__dirname, '..', '..', UPLOAD_PATH_TEMP);
  const targetDir = path.join(__dirname, '..', '..', UPLOAD_PATH);
  const tempPath = path.join(tempDir, fileName);
  const targetPath = path.join(targetDir, fileName);

  if (fs.existsSync(tempPath)) {
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }
    fs.renameSync(tempPath, targetPath);
  }
};

const deleteProductImage = (image: { fileName?: string }): void => {
  if (image && image.fileName) {
    const fileName = path.basename(image.fileName);
    const filePath = path.join(__dirname, '..', '..', UPLOAD_PATH, fileName);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }
};

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

    if (image && image.fileName) {
      const fileName = path.basename(image.fileName);
      moveFileFromTemp(fileName);
    }

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

export const updateProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { productId } = req.params;
    const { title, image, category, description, price } = req.body;

    if (image && image.fileName) {
      const fileName = path.basename(image.fileName);
      moveFileFromTemp(fileName);
    }

    const product = await Product.findByIdAndUpdate(
      productId,
      { title, image, category, description, price },
      { new: true, runValidators: true },
    );

    if (!product) {
      return next(new NotFoundError('Товар не найден'));
    }

    return res.status(200).json(product);
  } catch (err: any) {
    if (err.name === 'ValidationError') {
      return next(new BadRequestError('Ошибка валидации данных при обновлении товара'));
    }
    if (err.message?.includes('E11000')) {
      return next(new ConflictError('Товар с таким названием уже существует'));
    }
    return next(err);
  }
};

export const deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { productId } = req.params;
    const product = await Product.findByIdAndDelete(productId);

    if (!product) {
      return next(new NotFoundError('Товар не найден'));
    }

    if (product.image) {
      deleteProductImage(product.image);
    }

    return res.status(200).json(product);
  } catch (err) {
    return next(err);
  }
};