import { Router } from 'express';
import { createOrder } from '../controllers/order';
import { validateCreateOrder } from '../middlewares/validation';

const router = Router();

router.post('/order', validateCreateOrder, createOrder);

export default router;