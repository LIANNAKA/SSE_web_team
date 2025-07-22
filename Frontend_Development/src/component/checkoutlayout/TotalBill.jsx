import React, { useEffect, useState } from "react";
import { Container, Card, Button, Spinner, Alert } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";

const CheckoutBill = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Fetch cart from backend on mount
  useEffect(() => {
    fetch("http://localhost:5000/api/cart")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load cart");
        return res.json();
      })
      .then((data) => {
        setCartItems(data);
        setError("");
      })
      .catch(() => setError("Could not load cart. Please try again."))
      .finally(() => setLoading(false));
  }, []);

  // Compute total from cart items
  const totalBill = cartItems.reduce(
    (acc, item) => acc + (item.price || 0) * (item.quantity || 1),
    0
  );

  const handleNext = () => {
    navigate("/checkout/order");
  };

  return (
    <Container className="min-vh-100 d-flex align-items-center justify-content-center p-2" style={{ background: "#f9f9f9" }}>
      <Card className="p-4 shadow-sm w-100" style={{ maxWidth: 480 }}>
        <h2 className="mb-4 text-center fw-bold">Order Summary</h2>

        {loading ? (
          <div className="text-center"><Spinner animation="border" /></div>
        ) : error ? (
          <Alert variant="danger">{error}</Alert>
        ) : (
          <ul className="list-group mb-3">
            {cartItems.map((item, idx) => (
              <li key={idx} className="list-group-item d-flex justify-content-between align-items-center">
                {item.name} × {item.quantity}
                <span>₹{item.quantity * item.price}</span>
              </li>
            ))}
            <li className="list-group-item d-flex justify-content-between">
              <strong>Total Bill:</strong>
              <strong>₹{totalBill}</strong>
            </li>
          </ul>
        )}

        <div className="d-flex justify-content-between">
          <Link className="btn btn-outline-secondary flex-fill me-2" to="/checkout/shipping">
            Back
          </Link>
          <Button onClick={handleNext} className="flex-fill" variant="primary" disabled={!!error || loading}>
            Continue to Order
          </Button>
        </div>
      </Card>
    </Container>
  );
};

export default CheckoutBill;