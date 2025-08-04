import Order from "../models/Order.js";
import User from "../models/User.js";
import Product from "../models/Product.js";

// POST /api/orders

// POST /api/orders
export const createOrder = async (req, res) => {
  const { orderItems, shippingAddress, paymentMethod, totalPrice } = req.body;

  if (!orderItems || orderItems.length === 0) {
    return res.status(400).json({ message: "No order items" });
  }

  try {
    // ✅ Deduct stock before placing order
    for (const item of orderItems) {
      const product = await Product.findOne({ productId: item.product });

      if (!product) {
        return res.status(404).json({ message: `Product ${item.name} not found` });
      }

      if (product.stock < item.quantity) {
        return res
          .status(400)
          .json({ message: `Insufficient stock for ${product.name}` });
      }

      product.stock -= item.quantity;
      await product.save();
    }

    // ✅ Create order after stock update
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
    console.error("Create order error:", error);
    res.status(500).json({ message: "Failed to create order" });
  }
};


// GET /api/orders - Get all orders for logged-in user
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({
      createdAt: -1,
    });
    res.status(200).json(orders);
  } catch (error) {
    console.error("Get my orders error:", error);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};

// GET /api/orders
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate("user", "name email");
    res.status(200).json(orders);
  } catch (error) {
    console.error("Error in getAllOrders:", error.message); // 👈 Add this for debugging
    res.status(500).json({ message: "Server error while fetching orders" });
  }
};

// PUT /api/admin/update-order-status/:id
// PUT /api/admin/update-order-status/:id
export const updateOrderStatus = async (req, res) => {
  const { status } = req.body;

  try {
    const order = await Order.findById(req.params.orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.status === "cancelled") {
      return res.status(400).json({ message: "Cannot update a cancelled order" });
    }

    let stockMessage = "";

    // // Only adjust stock if status changed to delivered
    // if (status === "delivered" && order.status !== "delivered") {
    //   for (const item of order.orderItems) {
    //     const product = await Product.findById(item.product);
    //     if (product) {
    //       product.stock = product.stock - item.quantity;
    //       await product.save();
    //       stockMessage += `${product.name}: -${item.quantity} units\n`;
    //     }
    //   }
    // }

    order.status = status;
    await order.save();

    res.status(200).json({
      message: stockMessage || "Order status updated",
    });
  } catch (error) {
    console.error("Order update error:", error);
    res.status(500).json({ message: "Failed to update order status" });
  }
};


export const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Only the owner of the order can cancel
    if (order.user.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to cancel this order" });
    }

    // Prevent cancelling already delivered or cancelled orders
    if (["delivered", "cancelled"].includes(order.status.toLowerCase())) {
      return res
        .status(400)
        .json({ message: `Cannot cancel a ${order.status} order` });
    }

    order.status = "cancelled";
    await order.save();

    res.status(200).json({ message: "Order cancelled successfully" });
  } catch (error) {
    console.error("Cancel order error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
