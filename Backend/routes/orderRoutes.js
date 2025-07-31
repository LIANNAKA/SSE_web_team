import express from 'express';
import {
  createOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus, 
  cancelOrder,
} from '../controllers/orderController.js';

import { protect } from '../middleware/authMiddleware.js';
import { verifyAdmin } from '../middleware/verifyAdmin.js';

const router = express.Router();

router.post('/', protect, createOrder);
router.get('/', protect, getMyOrders);
router.get('/admin/all-orders', protect, verifyAdmin, getAllOrders);
router.put('/admin/update-order-status/:id', protect, verifyAdmin, updateOrderStatus);
router.patch('/cancel/:id', protect, cancelOrder);

export default router;
