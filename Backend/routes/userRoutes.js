import express from 'express';
import {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  getUserProfile,
  loginUser,
  registerUser,
  forgotPassword,
  resetPassword
} from '../controllers/userController.js';

const router = express.Router();

router.get('/', getUsers);
router.get('/profile/:id', getUserProfile);
router.post('/login', loginUser);
router.get('/:id', getUserById);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);
router.post('/register', registerUser); // user self-registers
router.get('/register', registerUser); // user self-registers
router.post('/forgot', forgotPassword);
router.post('/reset/:token', resetPassword);

export default router;
