import { Request, Response } from 'express';

export const uploadFile = (req: Request, res: Response) => {
  if (!req.file) {
    res.status(400).send({ message: 'Файл не загружен' });
    return;
  }

  res.send({
    fileName: `/images/${req.file.filename}`,
    originalName: req.file.originalname,
  });
};