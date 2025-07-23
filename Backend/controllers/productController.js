import Product from '../models/Product.js';
import { logToFile } from '../utils/logger.js';

// Auto-generate productId based on name
const generateProductId = (name) => {
  const trimmed = name.replace(/\s+/g, '').toLowerCase();
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `${trimmed}${randomNum}`;
}

// Create/Add a new product
export const createProduct = async (req, res) => {
  try {
    const { name, description, price, category, stock } = req.body;
    const productId = generateProductId(name);

    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

    console.log('Product Data Debug:', {
      name, description, price, category, stock, file: req.file
    });

    const product = new Product({
      productId,
      name,
      description,
      price,
      category,
      stock,
      imageUrl
    });

    await product.save();

    res.status(201).json({
      message: 'Product created successfully',
      product
    });
  } catch (err) {
    console.error("Error in createProduct:", err);
    res.status(500).json({ error: 'Error creating product', details: err.message });
  }
};

// Read all the list of product
export const getProducts = async (req, res) => {
  try {
    console.log('Inside getProducts Controller');
    const products = await Product.find();
    console.log('Products fetched:', products.length);
    res.json(products);
  } catch (err) {
    console.error('Error fetching products:', err);
    res.status(500).json({ error: 'Error fetching products', details: err.message });
  }
};

// Read one
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findOne({ productId: req.params.productId });
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching product' });
  }
};

//Update
export const updateProductByProductId = async (req, res) => {
  try {
    const { productId } = req.params;
    const { name, description, price, category, stock, imageUrl } = req.body;

    const updated = await Product.findOneAndUpdate(
      { productId },
      { name, description, price, category, stock, imageUrl },
      { new: true }
    );

    if (!updated) return res.status(404).json({ error: 'Product not found' });

    res.json({ message: 'Product updated', updated });
  } catch (err) {
    res.status(500).json({ error: 'Error updating product', details: err.message });
  }
};

//Delete
export const deleteProductByProductId = async (req, res) => {
  try {
    const product = await Product.findOneAndDelete({ productId: req.params.productId });
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json({ message: 'Product deleted successfully', product });
  } catch (err) {
    res.status(500).json({ error: 'Error deleting product', details: err.message });
  }
};

export const getProductStockStats = async (req, res) => {
  try {
    const products = await Product.find().select('name stock unitsSold');
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching product stock stats' });
  }
};

export const buyProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;
    if (!quantity || quantity <= 0) 
    return res.status(400).json({ error: 'Invalid quantity' });
  
    const product = await Product.findOne({productId});

    if (!product) return res.status(404).json({ error: 'Product not found' });
    

    if (product.stock < quantity) return res.status(400).json({ error: 'Insufficient stock' });

    product.stock -= quantity;
    product.unitsSold += quantity;

    await product.save();

    logToFile(`Product purchased: ${product.name} | Qty: ${quantity} | Remaining stock: ${product.stock} | Total sold: ${product.unitsSold}`);
    
    res.json({ message: 'Purchase successful', product });
  } catch (err) {
    res.status(500).json({ error: 'Purchase failed', details: err.message });
  }
};

export const restockProduct = async (req, res) => {
  try {
    const { productId} = req.params;
    const { quantity } = req.body;

    const product = await Product.findOne({productId});
    if (!product) return res.status(404).json({ error: 'Product not found' });

    product.stock += quantity;       

    await product.save();

    logToFile(`Product restocked: ${product.name} | Added: ${quantity} | New stock: ${product.stock}`);

    res.json({ message: 'Product restocked', product });
  } catch (err) {
    res.status(500).json({ error: 'Restock failed', details: err.message });
  }
};

export const getProductsByCategory = async (req, res) => {
  try {
    const { cat } = req.params;

    const products = await Product.find({ category: cat });
    if (products.length === 0) {
      return res.status(404).json({ message: `No products found in ${cat} category` });
    }

    res.json(products);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching category', details: err.message });
  }
};


export const searchProducts = async (req, res) => {
  try {
    const query = req.query.q;
    if (!query || !query.trim()) {
      return res.status(400).json({ error: "Invalid search query" });
    }

    // Search by name or description (case-insensitive)
    const results = await Product.find({
      $or: [
        { name: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
        { productId: { $regex: query, $options: "i" } },
      ]
    });

    res.json(results);
  } catch (err) {
    console.error("Error in searchProducts:", err);
    res.status(500).json({ error: "Search failed", details: err.message });
  }
};



