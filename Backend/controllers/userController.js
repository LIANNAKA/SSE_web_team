import User from '../models/User.js';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';

// get user by id
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id, 'name email mobile');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching user' });
  }
};

// update user details
export const updateUser = async (req, res) => {
  try {
    const { name, email, mobile } = req.body;
    await User.findByIdAndUpdate(req.params.id, { name, email, mobile });
    res.json({ message: 'User updated' });
  } catch (err) {
    res.status(500).json({ error: 'Update failed' });
  }
};

// delete user
export const deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Delete failed' });
  }
};


export const getUserProfile = async (req, res) => {
  try {
    const { id } = req.params; // user_id from URL
    const user = await User.findById(id).select('-__v'); // hide __v field it stands for versioning
    if (!user) return res.status(404).json({ error: 'User not found' });
    
    res.json({
      user_id: user._id,
      name: user.name,
      email: user.email,
      mobile: user.mobile,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    });
  } catch (err) {
    res.status(500).json({ error: 'Error fetching user profile' });
  }
};


export const registerUser = async (req, res) => {
  try {
    const { name, email, password, mobile } = req.body;
    
    // check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: 'User already exists' });
    }

    // hash password using bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // save new user
    // Extract first name only
  const firstName = name.split(' ')[0].toLowerCase();

  // Generate 4-digit random number
  const randomDigits = Math.floor(1000 + Math.random() * 9000);

  // Combine to create custom userId
  const customUserId = `${firstName}${randomDigits}`;

  const newUser = new User({
    userId: customUserId,
    name,
    email,
    password: hashedPassword,
    mobile
  });

    
    await newUser.save();
    
  res.status(201).json({ message: 'User registered successfully', userId: newUser.userId });

  } catch (err) {
    res.status(500).json({ error: 'Registration failed', details: err.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // 1. Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    
    // 2. Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    
  // Generate JWT token here
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    //Send token with response
    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        user_id: user._id,
        name: user.name,
        email: user.email,
        mobile: user.mobile
      },
      token: token
    });

  } catch (err) {
    res.status(500).json({ error: 'Login failed', details: err.message });
  }
};

// user forgot password
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: 'User not found' });
    
    const token = crypto.randomBytes(32).toString('hex');
    const expiry = Date.now() + 3600000; // 1 hour
    
    user.resetToken = token;
    user.resetTokenExpiry = expiry;
    await user.save();
    
    // For now, return token in response (simulate email)
    res.json({
      message: 'Password reset link generated',
      resetLink: `http://localhost:5000/api/users/reset/${token}`
    });
  } catch (err) {
    res.status(500).json({ error: 'Error generating reset link', details: err.message });
  }
};

// user reset password
export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;
    
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() } // check not expired
    });
    
    if (!user) return res.status(400).json({ error: 'Invalid or expired token' });
    
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    
    await user.save();
    
    res.json({ message: 'Password has been reset successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Error resetting password', details: err.message });
  }
};


export const getUsers = async (req, res) => {
  try {
    const users = await User.find({}, 'userId name email mobile address company companyAddress createdAt');
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching users' });
  }
};

// Get logged-in user's address
export const getOwnProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('name address mobile');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({
      name: user.name || "",
      address: user.address || "",
      mobile: user.mobile || ""
    });
  } catch (err) {
    res.status(500).json({ error: 'Error fetching profile' });
  }
};


// Update logged-in user's address
export const updateAddress = async (req, res) => {
  try {
    const { address } = req.body;
    if (!address) return res.status(400).json({ error: 'Address is required' });

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    user.address = address;
    await user.save();

    res.json({ message: 'Address updated successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Error updating address' });
  }
};

export const updateAddressAndCompany = async (req, res) => {
  try {
    const { address, company, companyAddress } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    if (address !== undefined) user.address = address;
    if (company !== undefined) user.company = company;
    if (companyAddress !== undefined) user.companyAddress = companyAddress;

    await user.save();

    res.json({ message: 'Profile updated successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Error updating profile' });
  }
};

// Add/remove from wishlist
export const toggleWishlist = async (req, res) => {
  const user = await User.findById(req.user.userId);
  const { productId } = req.body;

  const index = user.wishlist.indexOf(productId);
  if (index > -1) {
    user.wishlist.splice(index, 1); // Remove
  } else {
    user.wishlist.push(productId); // Add
  }

  await user.save();
  res.json(user.wishlist);
};

export const getWishlist = async (req, res) => {
  const user = await User.findById(req.user._id).populate("wishlist");
  res.json(user.wishlist);
};


export const addToWishlist = async (req, res) => {
  const { productId } = req.body;
  const userId = req.user.userId;

  try {
    const product = await product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const user = await User.findById(userId);
    if (user.wishlist.includes(productId)) {
      return res.status(400).json({ message: "Already in wishlist" });
    }

    user.wishlist.push(productId);
    await user.save();

    res.status(201).json({ message: "Product added to wishlist" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const removeFromWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const productId = req.params.productId;

    if (!user) return res.status(404).json({ message: "User not found" });

    user.wishlist = user.wishlist.filter(id => id.toString() !== productId);
    await user.save();

    res.status(200).json({ message: "Product removed from wishlist" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error while removing from wishlist" });
  }
};

