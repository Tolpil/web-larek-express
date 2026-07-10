import mongoose from 'mongoose';
import path from 'path';
import fs from 'fs';

export interface IProduct {
  title: string;
  image: {
    fileName: string;
    originalName: string;
  };
  category: string;
  description?: string;
  price?: number | null;
}

const productSchema = new mongoose.Schema<IProduct>({
  title: {
    type: String,
    required: [true, 'Поле "title" должно быть заполнено'],
    unique: true,
    minlength: [2, 'Минимальная длина поля "title" - 2'],
    maxlength: [30, 'Максимальная длина поля "title" - 30'],
  },
  image: {
    type: Object,
    required: [true, 'Поле "image" должно быть заполнено'],
  },
  category: {
    type: String,
    required: [true, 'Поле "category" должно быть заполнено'],
  },
  description: {
    type: String,
  },
  price: {
    type: Number,
    default: null,
  },
});

productSchema.post('findOneAndDelete', function (doc) {
  if (doc && doc.image && doc.image.fileName) {
    const fileName = path.basename(doc.image.fileName);
    const filePath = path.join(__dirname, '..', '..', 'public', 'images', fileName);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }
});

export default mongoose.model<IProduct>('product', productSchema);