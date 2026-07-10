import { Router } from 'express';
import { getProducts, createProduct, updateProduct, deleteProduct } from '../controllers/product';
import { validateCreateProduct } from '../middlewares/validation';
import auth from '../middlewares/auth';

const router = Router();

router.get('/product', getProducts);
router.post('/product', auth, validateCreateProduct, createProduct);
router.patch('/product/:productId', auth, updateProduct);
router.delete('/product/:productId', auth, deleteProduct);

export default router;