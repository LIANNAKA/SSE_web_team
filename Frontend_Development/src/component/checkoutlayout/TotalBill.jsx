import React, { useEffect, useState } from "react";
import { Container, Card, Button, Spinner, Alert, Table } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";

const CheckoutBill = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

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

  const totalBill = cartItems.reduce(
    (acc, item) => acc + (item.price || 0) * (item.quantity || 1),
    0
  );

  const handleNext = () => {
    navigate("/checkout/order");
  };

  return (
    <Container className="min-vh-100 d-flex align-items-center justify-content-center p-2" style={{ background: "#f9f9f9" }}>
      <Card className="p-4 shadow-sm w-100" style={{ maxWidth: 700 }}>
        <h2 className="mb-4 text-center fw-bold">Order Summary</h2>

        {loading ? (
          <div className="text-center"><Spinner animation="border" /></div>
        ) : error ? (
          <Alert variant="danger">{error}</Alert>
        ) : (
          <Table bordered hover responsive className="mb-4">
            <thead className="table-light">
              <tr>
                <th>Product Name</th>
                <th>Quantity</th>
                <th>Price (₹)</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item, idx) => (
                <tr key={idx}>
                  <td>{item.name}</td>
                  <td>{item.quantity}</td>
                  <td>₹{item.quantity * item.price}</td>
                </tr>
              ))}
              <tr className="fw-bold">
                <td colSpan="2" className="text-end">Total:</td>
                <td>₹{totalBill}</td>
              </tr>
            </tbody>
          </Table>
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
