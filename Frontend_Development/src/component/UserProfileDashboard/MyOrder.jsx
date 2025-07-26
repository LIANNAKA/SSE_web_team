// src/UserProfileDashboard/MyOrders.jsx
import React, { useEffect, useState } from "react";
import {
  Container,
  Card,
  Table,
  Tabs,
  Tab,
  Spinner,
  Alert,
} from "react-bootstrap";
import axios from "axios";

const MyOrders = () => {
  const [currentOrders, setCurrentOrders] = useState([]);
  const [pastOrders, setPastOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/orders", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const allOrders = res.data;

        const current = allOrders.filter((order) =>
          ["pending", "processing", "shipped"].includes(
            order.status?.toLowerCase()
          )
        );

        const past = allOrders.filter((order) =>
          ["delivered", "cancelled"].includes(order.status?.toLowerCase())
        );

        setCurrentOrders(current);
        setPastOrders(past);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch orders:", err);
        setError("Failed to load orders.");
        setLoading(false);
      });
  }, []);

  const renderOrderTable = (orders) => (
    <Table striped bordered hover responsive>
      <thead>
        <tr>
          <th>Order ID</th>
          <th>Items</th>
          <th>Total Amount</th>
          <th>Status</th>
          <th>Ordered On</th>
        </tr>
      </thead>
      <tbody>
        {orders.map((order, index) => (
          <tr key={index}>
            <td>{order._id || "N/A"}</td>
            <td>
              {Array.isArray(order.orderItems) && order.orderItems.length > 0 ? (
                order.orderItems.map((item, i) => (
                  <div key={i}>
                    {item.name} × {item.quantity}
                  </div>
                ))
              ) : (
                <div>No items</div>
              )}
            </td>
            <td>₹{order.totalPrice || "N/A"}</td>
            <td
              className={`text-capitalize fw-semibold ${
                order.status === "cancelled"
                  ? "text-danger"
                  : order.status === "delivered"
                  ? "text-success"
                  : "text-primary"
              }`}
            >
              {order.status || "N/A"}
            </td>
            <td>
              {order.createdAt
                ? new Date(order.createdAt).toLocaleDateString()
                : "Date N/A"}
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" />
      </Container>
    );
  }

  return (
    <Container className="my-4">
      <Card className="shadow-sm p-4">
        <h3 className="fw-bold mb-4">🧾 My Orders</h3>

        {error && <Alert variant="danger">{error}</Alert>}

        <Tabs defaultActiveKey="current" className="mb-3" fill>
          <Tab eventKey="current" title="📦 Current Orders">
            {currentOrders.length > 0 ? (
              renderOrderTable(currentOrders)
            ) : (
              <p>No active orders at the moment.</p>
            )}
          </Tab>
          <Tab eventKey="past" title="📜 Order History">
            {pastOrders.length > 0 ? (
              renderOrderTable(pastOrders)
            ) : (
              <p>No past orders found.</p>
            )}
          </Tab>
        </Tabs>
      </Card>
    </Container>
  );
};

export default MyOrders;