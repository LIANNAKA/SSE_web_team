// OrderStatusPage.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Button, Form } from "react-bootstrap";

const AdminOrderStatusPage = () => {
  const [orders, setOrders] = useState([]);
  const [updating, setUpdating] = useState(null); // To track status update in progress

  const token = localStorage.getItem("adminToken");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/orders/admin/all-orders",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setOrders(res.data);
    } catch (error) {
      console.error(error);
      alert("Failed to fetch orders");
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      setUpdating(orderId);
      await axios.put(
        `http://localhost:5000/api/orders/admin/update-order-status/${orderId}`,
        { status: newStatus },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      await fetchOrders(); // refresh data
      setUpdating(null);
    } catch (error) {
      console.error(error);
      alert("Failed to update order status");
      setUpdating(null);
    }
  };

  const statusOptions = [
    "pending",
    "processing",
    "shipped",
    "delivered",
    "cancelled",
  ];

  return (
    <div className="container mt-4">
      <h2>📦 Order Status</h2>
      {orders.length === 0 ? (
        <p>No orders yet.</p>
      ) : (
        <table bordered striped hover responsive>
          <thead className="table-dark">
            <tr>
              <th>User</th>
              <th>Address</th>
              <th>Items</th>
              <th>Total Amount</th>
              <th>Status</th>
              <th>Change Status</th>
              <th>Placed On</th>
            </tr>
          </thead>
          <tbody>
            {orders
              .filter((order) => order.user)
              .map((order) => (
                <tr key={order._id}>
                  <td>{order.user?.name}</td>
                  <td>{order.user?.address}</td>
                  <td>
                    {Array.isArray(order.orderItems) &&
                    order.orderItems.length > 0 ? (
                      order.orderItems.map((item, i) => (
                        <div key={i}>
                          {item.name} × {item.quantity}
                        </div>
                      ))
                    ) : (
                      <span>No items</span>
                    )}
                  </td>
                  <td>₹{order.totalPrice || "N/A"}</td>
                  <td className="text-capitalize fw-semibold">
                    {order.status}
                  </td>
                  <td>
                    <Form.Select
                      value={order.status}
                      onChange={(e) =>
                        handleStatusChange(order._id, e.target.value)
                      }
                      disabled={updating === order._id}
                    >
                      {statusOptions.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </Form.Select>
                  </td>
                  <td>{new Date(order.createdAt).toLocaleString()}</td>
                </tr>
              ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminOrderStatusPage;

// PUT /api/admin/update-order-status/:id
// router.put('/admin/update-order-status/:id', verifyAdmin, async (req, res) => {
//   const { status } = req.body;
//   try {
//     const order = await Order.findByIdAndUpdate(
//       req.params.id,
//       { status },
//       { new: true }
//     );
//     res.json(order);
//   } catch (err) {
//     res.status(500).json({ message: "Failed to update order status" });
//   }
// });
