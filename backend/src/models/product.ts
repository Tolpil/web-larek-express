import mongoose from 'mongoose';

export interface IProduct {
  name: string;
  description: string;
  category: string;
  price: number;
  image: string;
}

const productSchema = new mongoose.Schema<IProduct>({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
});

export default mongoose.model<IProduct>('product', productSchema);