import React, { useState, useEffect } from "react";
import { Container, Card, Button, Alert, Spinner, Table } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";

const CheckoutOrder = () => {
  const [shipping, setShipping] = useState({ name: "", address: "", mobile: "" });
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [orderSending, setOrderSending] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("checkoutShipping")) || { name: "", address: "", mobile: "" };
    setShipping(saved);

    fetch("http://localhost:5000/api/cart")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch cart");
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

  const handleOrder = async () => {
    setOrderSending(true);
    setMessage("");
    setError("");
    const orderPayload = {
      customer: shipping,
      cartItems,
      totalBill,
    };
    try {
      const res = await fetch("http://localhost:5000/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload),
      });
      if (!res.ok) throw new Error("Order failed");
      setMessage("Order placed successfully!");
      localStorage.removeItem("checkoutShipping");
      setTimeout(() => navigate("/"), 2000);
    } catch {
      setError("Order failed. Try again.");
    } finally {
      setOrderSending(false);
    }
  };

  return (
    <Container className="min-vh-100 d-flex align-items-center justify-content-center p-2" style={{ background: "#f9f9f9" }}>
      <Card className="p-4 shadow-sm w-100" style={{ maxWidth: 700 }}>
        <h2 className="mb-4 text-center fw-bold">Place Your Order</h2>
        <p>
          <b>Name:</b> {shipping.name} <br />
          <b>Shipping Address:</b> {shipping.address} <br />
          <b>Mobile:</b> {shipping.mobile}
        </p>
        <h5 className="mt-4">Items:</h5>
        {loading ? (
          <div className="text-center"><Spinner animation="border" /></div>
        ) : error ? (
          <Alert variant="danger">{error}</Alert>
        ) : (
          <Table bordered hover responsive className="mb-3">
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

        {message && <Alert variant="success">{message}</Alert>}
        {error && <Alert variant="danger">{error}</Alert>}

        <div className="d-flex justify-content-between">
          <Link className="btn btn-outline-secondary flex-fill me-2" to="/checkout/bill">
            Back
          </Link>
          <Button
            className="flex-fill"
            variant="success"
            onClick={handleOrder}
            disabled={!!error || loading || orderSending}
          >
            {orderSending ? "Placing..." : "Confirm Order"}
          </Button>
        </div>
      </Card>
    </Container>
  );
};

export default CheckoutOrder;
