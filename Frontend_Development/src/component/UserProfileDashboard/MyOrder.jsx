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
        console.log("📦 Raw orders from backend:", allOrders);
        // Filter into current and past based on status
        const current = allOrders.filter((order) =>
          ["pending", "processing", "shipped"].includes(
            order.status?.toLowerCase()
          )
        );
        allOrders.forEach((order, i) =>
          console.log(`Order ${i + 1} status:`, order.status)
        );

        console.log("🟢 Current Orders after filtering:", current);

        const past = allOrders.filter((order) =>
          ["delivered", "cancelled"].includes(order.status?.toLowerCase())
        );
        console.log("🔴 Past Orders after filtering:", past);
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
  console.log("Current Orders:", currentOrders);
  console.log("First Order Item:", currentOrders[0]?.orderItems?.[0]);
  if (currentOrders.length > 0) {
    console.log("First order item example:", currentOrders[0].orderItems);
  }

  const renderOrderCards = (orders) => (
    <>
      {orders.map((order, index) => (
        <Card key={index} className="mb-4 shadow-sm">
          <Card.Header className="d-flex justify-content-between align-items-center">
            <div>
              <b>Order ID:</b> {order._id || "N/A"} <br />
              <b>Status:</b>{" "}
              <span
                className={`text-capitalize fw-semibold ${
                  order.status === "cancelled"
                    ? "text-danger"
                    : order.status === "delivered"
                    ? "text-success"
                    : "text-primary"
                }`}
              >
                {order.status}
              </span>
            </div>
            <div className="text-muted">
              {order.createdAt
                ? new Date(order.createdAt).toLocaleDateString()
                : "Date N/A"}
            </div>
          </Card.Header>

          <Card.Body>
            {Array.isArray(order.orderItems) && order.orderItems.length > 0 ? (
              order.orderItems.map((item, i) => (
                <Card key={i} className="mb-3 shadow-sm">
                  <Card.Body>
                    <div className="d-flex align-items-center">
                      {item.imageUrl && (
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          style={{
                            width: "80px",
                            height: "80px",
                            objectFit: "cover",
                            marginRight: "15px",
                            borderRadius: "8px",
                          }}
                        />
                      )}
                      <div>
                        <Card.Title>{item.name}</Card.Title>
                        <Card.Text className="mb-0">
                          Quantity: {item.quantity} <br />
                          Price: ₹{item.price} <br />
                          Subtotal: ₹{item.price * item.quantity}
                        </Card.Text>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              ))
            ) : (
              <p className="text-muted">No items in this order.</p>
            )}

            <div className="text-end fw-bold mt-2">
              Total: ₹{order.totalPrice || "N/A"}
            </div>
          </Card.Body>
        </Card>
      ))}
    </>
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
              renderOrderCards(currentOrders)
            ) : (
              <p>No active orders at the moment.</p>
            )}
          </Tab>
          <Tab eventKey="past" title="📜 Order History">
            {pastOrders.length > 0 ? (
              renderOrderCards(pastOrders)
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
