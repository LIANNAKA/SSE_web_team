import Order from '../models/Order.js';
import User from '../models/User.js';

// POST /api/orders
export const createOrder = async (req, res) => {
  const { orderItems, shippingAddress, paymentMethod, totalPrice } = req.body;

  if (!orderItems || orderItems.length === 0) {
    return res.status(400).json({ message: 'No order items' });
  }

  try {
    const order = new Order({
      user: req.user._id,
      orderItems,
      shippingAddress,
      paymentMethod,
      totalPrice,
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ message: 'Failed to create order' });
  }
};

// GET /api/orders - Get all orders for logged-in user
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    console.error('Get my orders error:', error);
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
};

// GET /api/orders
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('user', 'name email');
    res.status(200).json(orders);
  } catch (error) {
    console.error("Error in getAllOrders:", error.message); // 👈 Add this for debugging
    res.status(500).json({ message: "Server error while fetching orders" });
  }
};

// PUT /api/admin/update-order-status/:id
export const updateOrderStatus = async (req, res) => {
  const { status } = req.body;
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: "Failed to update order status" });
  }
};
