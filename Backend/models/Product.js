import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  productId: { type: String, unique: true },
  name: { type: String, required: true },
  company: { type: String },
  description: String,
  price: { type: Number, required: true },
  category: {
    type: String,
    required: true,
    enum: ['Stationary','Housekeeping']
  },
  stock: { type: Number, default: 0 },
  imageUrl: String,
  unitsSold: { type: Number, default: 0 },
  displayLocations: {
  type: [String],
  default: []
}
}, { timestamps: true });
// to remove mongoDb _id
productSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

export default mongoose.model('Product', productSchema);