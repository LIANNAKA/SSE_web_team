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
    enum: [
  'Adhesives',
  'Calculator',
  'Disposable Items',
  'Envelope',
  'Eraser',
  'File/Folder',
  'Highlighter',
  'Marker',
  'Miscellaneous',
  'Paper',
  'Pen',
  'Pencil',
  'Printer',
  'Register',
  'Tools',
  'Air Fresheners',
  'Mops & Wipers',
  'Pest Control',
  'Stationary',
  'Cleaning'
]
  },
  stock: { type: Number, default: 0 },
  imageUrl: String,
  unitsSold: { type: Number, default: 0 },

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
