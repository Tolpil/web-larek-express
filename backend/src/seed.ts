import mongoose from 'mongoose';
import * as fs from 'fs';
import * as path from 'path';
import Product from './models/product';

const { DB_ADDRESS = 'mongodb://127.0.0.1:27017/weblarek' } = process.env;

mongoose.connect(DB_ADDRESS)
  .then(async () => {
    console.log('Connected to MongoDB');

    const filePath = path.join(__dirname, '..', 'product.json');
    const rawData = fs.readFileSync(filePath, 'utf-8');
    const products = JSON.parse(rawData);

    await Product.deleteMany({});
    console.log('Old products deleted');

    await Product.insertMany(products);
    console.log(`${products.length} products inserted`);

    await mongoose.connection.close();
    console.log('Done');
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });