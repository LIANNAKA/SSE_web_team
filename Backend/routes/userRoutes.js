import express from "express";
import {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  getUserProfile,
  loginUser,
  registerUser,
  forgotPassword,
  resetPassword,
  updateAddressAndCompany,
  getOwnProfile,
  toggleWishlist,
  getWishlist,
  removeFromWishlist,
} from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";


const router = express.Router();

router.get("/", getUsers);
router.get("/profile", protect, getOwnProfile);
router.get("/profile/:id", getUserProfile);
router.put("/update-address-company", protect, updateAddressAndCompany);
router.get("/shipping-info", protect, getOwnProfile);
router.post("/login", loginUser);
router.get("/:id", getUserById);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);
router.post("/register", registerUser); // user self-registers
router.get("/register", registerUser); // user self-registers
router.post("/forgot", forgotPassword);
router.post("/reset/:token", resetPassword);
router.get('/wishlist', protect, getWishlist);
router.post('/wishlist', protect, toggleWishlist);
router.delete('/wishlist/:productId', protect, removeFromWishlist);

export default router;
