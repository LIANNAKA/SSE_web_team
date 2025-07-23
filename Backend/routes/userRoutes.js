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
} from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";


const router = express.Router();

router.get("/", getUsers);
router.get("/profile", protect, getOwnProfile);
router.get("/profile/:id", getUserProfile);
router.put("/update-address-company", protect, updateAddressAndCompany);
router.post("/login", loginUser);
router.get("/:id", getUserById);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);
router.post("/register", registerUser); // user self-registers
router.get("/register", registerUser); // user self-registers
router.post("/forgot", forgotPassword);
router.post("/reset/:token", resetPassword);

export default router;
