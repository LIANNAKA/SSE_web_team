import mongoose from 'mongoose';

const adminSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  mobile: String,
  isAdmin: { type: Boolean, default: true },
  resetToken: String,
  resetTokenExpiry: Date
});

export default mongoose.model('Admin', adminSchema);

