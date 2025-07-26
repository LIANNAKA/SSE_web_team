import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    userId: { type: String, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    mobile: { type: String },
    address: { type: String, default: "" },
    company: { type: String, default: "" },
    companyAddress: { type: String, default: "" },
    resetToken: { type: String },
    resetTokenExpiry: { type: Date },
    wishlist: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
