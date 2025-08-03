import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Form, Spinner } from "react-bootstrap";
import StatusMessage from "./StatusMessage";

const AdminOrderStatusPage = () => {
  const [orders, setOrders] = useState([]);
  const [updating, setUpdating] = useState(null);
  const [message, setMessage] = useState(null);
  const [statusFilter, setStatusFilter] = useState(""); // "" means show all
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
      const res = await axios.put(
        `http://localhost:5000/api/orders/admin/update-order-status/${orderId}`,
        { status: newStatus },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      await fetchOrders();
      setUpdating(null);

      if (res.data.message) {
        setMessage(res.data.message);
      }
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
    <div className="container">
      <h2 className="mb-4">📦 Admin Order Status</h2>

      <div className="mb-3 d-flex align-items-center gap-2">
        <label className="fw-semibold">Filter by Status:</label>
        <Form.Select
          size="sm"
          style={{ maxWidth: "200px" }}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All</option>
          {statusOptions.map((status) => (
            <option key={status} value={status}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </option>
          ))}
        </Form.Select>
      </div>

      {orders.length === 0 ? (
        <p className="text-muted text-center">No orders found.</p>
      ) : (
        <Table bordered hover responsive className="shadow-sm">
          <thead className="table-dark">
            <tr>
              <th>User</th>
              <th>Address</th>
              <th>Items Ordered</th>
              <th>Total Amount</th>
              <th>Status</th>
              <th>Change Status</th>
              <th>Placed On</th>
            </tr>
          </thead>
          <tbody>
            {[...orders]
              .filter((order) => order.user)
              .filter((order) => !statusFilter || order.status === statusFilter)
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
              .map((order) => (
                <tr key={order._id}>
                  <td>{order.user.name}</td>
                  <td>{order.user.address}</td>
                  <td>
                    <ul className="mb-0 ps-3">
                      {order.orderItems?.map((item, idx) => (
                        <li key={idx}>
                          {item.name} × {item.quantity}
                        </li>
                      ))}
                    </ul>
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
                      disabled={
                        updating === order._id || order.status === "cancelled"
                      }
                      className="form-select-sm"
                    >
                      {statusOptions.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </Form.Select>

                    {updating === order._id && (
                      <div className="mt-1 text-primary">
                        <Spinner size="sm" animation="border" />
                      </div>
                    )}
                  </td>
                  <td>
                    {new Date(order.createdAt).toLocaleString("en-IN", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </td>
                </tr>
              ))}
          </tbody>
        </Table>
      )}

      {/* Popup for stock update message */}
      {message && (
        <StatusMessage
          type="success"
          message={message}
          onClose={() => setMessage(null)}
        />
      )}
    </div>
  );
};

export default AdminOrderStatusPage;
