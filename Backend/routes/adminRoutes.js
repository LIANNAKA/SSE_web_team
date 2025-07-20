import express from 'express';
import {
  signup,
  login,
  adminForgotPassword,
  adminResetPassword,
  createUser,
  getUsers,
  deleteUser,
  getProductStats
} from '../controllers/adminController.js';
import { getProductsByCategory } from '../controllers/productController.js';
import { verifyAdmin } from '../middleware/verifyAdmin.js';


const router = express.Router();

router.get('/all-users', verifyAdmin, getUsers);
router.get('/product-listing', getProductStats); // New route for admin listing
router.post('/signup', signup);
router.post('/login', login);
router.post('/forgot', adminForgotPassword);
router.post('/reset/:token', adminResetPassword);
router.post('/create-user', createUser);
router.delete('/delete-user/:id', deleteUser);
router.get('/product-category/:cat', getProductsByCategory);

router.get('/all-users', verifyAdmin, getUsers);
router.post('/create-user', verifyAdmin, createUser);
router.delete('/delete-user/:id', verifyAdmin, deleteUser);



// add category here as well

export default router;
