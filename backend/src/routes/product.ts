import { Router } from 'express';
import { getProducts, createProduct, updateProduct, deleteProduct } from '../controllers/product';
import { validateCreateProduct } from '../middlewares/validation';

const router = Router();

router.get('/product', getProducts);
router.post('/product', validateCreateProduct, createProduct);
router.patch('/product/:productId', updateProduct);
router.delete('/product/:productId', deleteProduct);

export default router;