import express from 'express';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';

const router = express.Router();

// Middleware example to get userId from auth token or session
const authenticateUser = (req, res, next) => {
  // For demo: we'll fake a userId, ideally get from decoded token
  req.userId = 'demoUser123';
  next();
};

router.use(authenticateUser);

// GET /api/cart — get current user cart
router.get('/', async (req, res) => {
  try {
    let cart = await Cart.findOne({ userId: req.userId });
    if (!cart || cart.items.length === 0) return res.json([]);

    const productIds = cart.items.map(item => item.productId);
    const products = await Product.find({ productId: { $in: productIds } });

    const cartWithDetails = cart.items.map(item => {
      const prod = products.find(p => p.productId === item.productId) || {};
      return {
        productId: item.productId,
        quantity: item.quantity,
        name: prod.name,
        price: prod.price,
        description: prod.description,
        image: prod.imageUrl,
      };
    });

    res.json(cartWithDetails);
  } catch (error) {
    console.error('Failed to fetch cart:', error);
    res.status(500).json({ error: 'Failed to fetch cart' });
  }
});

// POST /api/cart — add product to cart (or increase qty)
router.post('/', async (req, res) => {
  const { productId, quantity } = req.body;
  if (!productId) return res.status(400).json({ error: 'Missing productId' });

  try {
    let cart = await Cart.findOne({ userId: req.userId });
    if (!cart) {
      cart = new Cart({ userId: req.userId, items: [] });
    }

    const itemIndex = cart.items.findIndex(i => i.productId === productId);
    if (itemIndex > -1) {
      // item exists, update quantity
      cart.items[itemIndex].quantity += quantity || 1;
    } else {
      // add new item
      cart.items.push({ productId, quantity: quantity || 1 });
    }

    await cart.save();
    res.json(cart.items);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add to cart' });
  }
});

// PATCH /api/cart/:productId — update quantity
router.patch('/:productId', async (req, res) => {
  const { productId } = req.params;
  const { quantity } = req.body;
  if (quantity < 1) return res.status(400).json({ error: 'Quantity must be >= 1' });

  try {
    let cart = await Cart.findOne({ userId: req.userId });
    if (!cart) return res.status(404).json({ error: 'Cart not found' });

    const itemIndex = cart.items.findIndex(i => i.productId === productId);
    if (itemIndex === -1) return res.status(404).json({ error: 'Item not found in cart' });

    cart.items[itemIndex].quantity = quantity;
    await cart.save();
    res.json(cart.items[itemIndex]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update quantity' });
  }
});


// DELETE /api/cart/clear — clear all items from the cart
router.delete('/clear', async (req, res) => {
  try {
    let cart = await Cart.findOne({ userId: req.userId });
    if (!cart) return res.status(404).json({ error: 'Cart not found' });
    
    cart.items = []; // empty the cart
    await cart.save();

    res.json({ message: 'Cart cleared successfully' });
  } catch (error) {
    console.error("Error clearing cart:", error);
    res.status(500).json({ error: 'Failed to clear cart' });
  }
});

// DELETE /api/cart/:productId — remove item from cart
router.delete('/:productId', async (req, res) => {
  const { productId } = req.params;

  try {
    let cart = await Cart.findOne({ userId: req.userId });
    if (!cart) return res.status(404).json({ error: 'Cart not found' });

    cart.items = cart.items.filter(i => i.productId !== productId);
    await cart.save();
    res.json({ message: 'Item removed' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to remove item' });
  }
});
export default router;
