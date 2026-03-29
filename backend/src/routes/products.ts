import { Router } from 'express';
import {
  getProducts, getProduct, createProduct, updateProduct, deleteProduct,
} from '../controllers/products.controller';
import { protect } from '../middleware/auth';

const router = Router();

router.get('/',     getProducts);
router.get('/:slug', getProduct);
router.post('/',    protect, createProduct);
router.put('/:id',  protect, updateProduct);
router.delete('/:id', protect, deleteProduct);

export default router;
