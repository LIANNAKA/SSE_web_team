import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import adminRoutes from './routes/adminRoutes.js';
import userRoutes from './routes/userRoutes.js';
import productRoutes from './routes/productRoutes.js';
import homePageRoutes from './routes/homePageRoutes.js';
import productImageRoutes from './routes/productImageRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import cors from 'cors';

dotenv.config();
connectDB();

const app = express();
app.use(cors({ origin: 'http://localhost:5173', credentials: true, allowedHeaders: ["Content-Type", "Authorization"], }));
app.use(express.json());

app.use('/api/admin', adminRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/product-image', productImageRoutes);
app.use('/uploads', express.static('uploads'));
app.use('/api/banner', homePageRoutes); 
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);


  


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port http://localhost:${PORT}`));
