import mongoose from 'mongoose';
import * as fs from 'fs';
import * as path from 'path';
import Product from './models/product';

const { DB_ADDRESS = 'mongodb://127.0.0.1:27017/weblarek' } = process.env;

mongoose.connect(DB_ADDRESS)
  .then(async () => {
    process.stdout.write('Connected to MongoDB\n');

    const filePath = path.join(__dirname, '..', 'product.json');
    const rawData = fs.readFileSync(filePath, 'utf-8');
    const products = JSON.parse(rawData);

    await Product.deleteMany({});
    process.stdout.write('Old products deleted\n');

    await Product.insertMany(products);
    process.stdout.write(`${products.length} products inserted\n`);

    await mongoose.connection.close();
    process.stdout.write('Done\n');
  })
  .catch((err) => {
    process.stderr.write(`${err}\n`);
    process.exit(1);
  });