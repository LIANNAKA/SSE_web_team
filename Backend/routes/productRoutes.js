import express from 'express';
import {
  createProduct,
  getProducts,
  getProductById,
  updateProductByProductId,
  getProductStockStats,
  restockProduct ,
  buyProduct,
  getProductsByCategory,
  deleteProductByProductId,
  searchProducts,
} from '../controllers/productController.js';
import upload from '../middleware/upload.js';  

const router = express.Router();

router.post('/add-product', upload.single('image'), createProduct);
router.get('/all', getProducts);
router.get('/', getProducts);
router.get('/search', searchProducts);
router.get('/:productId', getProductById);   
router.put('/update-by-productid/:productId', updateProductByProductId);
router.get('/admin/stock', getProductStockStats); 
router.post('/buy/:productId', buyProduct);
router.put('/restock/:productId', restockProduct);  
router.get('/category/:cat', getProductsByCategory);
router.delete('/:productId', deleteProductByProductId);

export default router;