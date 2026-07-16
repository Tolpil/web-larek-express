import { Router } from 'express';
import { getProducts, createProduct, updateProduct, deleteProduct } from '../controllers/product';
import { validateCreateProduct, validateUpdateProduct, validateProductId } from '../middlewares/validation';
import auth from '../middlewares/auth';

const router = Router();

router.get('/product', getProducts);
router.post('/product', auth, validateCreateProduct, createProduct);
router.patch('/product/:productId', auth, validateUpdateProduct, updateProduct);
router.delete('/product/:productId', auth, validateProductId, deleteProduct);

export default router;