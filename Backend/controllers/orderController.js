import Order from '../models/Order.js';
import Product from '../models/Product.js';

export const createOrder = async (req, res) => {
  try {
    const { orderItems, shippingAddress, paymentMethod, totalPrice } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: 'No order items' });
    }

    // Enrich each item with details from the product model
    const enrichedOrderItems = await Promise.all(
      orderItems.map(async (item) => {
        const product = await Product.findOne({ productId: item.product }); // item.product is productId

        if (!product) {
          throw new Error(`Product not found: ${item.product}`);
        }
        console.log("Matched product from DB:", product);

        return {
          name: product.name,
          quantity: item.quantity,
          price: product.price,
          imageUrl: product.imageUrl,
          product: product._id,
        };
      })
    );

    const order = new Order({
      user: req.user.userId,
      orderItems: enrichedOrderItems,
      shippingAddress,
      paymentMethod,
      totalPrice,
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error creating order' });
  }
};

export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.userId });
    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching orders' });
  }
};
