import React, { useState, useEffect } from "react";
import { Container, Row, Col, ButtonGroup, Button, Card, Form, Spinner, Alert } from "react-bootstrap";

const CheckoutPage = () => {
  const [tab, setTab] = useState("shipping");
  const [fullName, setFullName] = useState("");
  const [address, setAddress] = useState("");
  const [mobile, setMobile] = useState("");

  const [cartItems, setCartItems] = useState([]);
  const [cartLoading, setCartLoading] = useState(true);
  const [orderSending, setOrderSending] = useState(false);
  const [cartError, setCartError] = useState("");
  const [orderMessage, setOrderMessage] = useState("");

  // Fetch cart from backend when component mounts
  useEffect(() => {
    setCartLoading(true);
    fetch("http://localhost:5000/api/cart")
      .then(res => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then(data => setCartItems(data))
      .catch(() => setCartError("Could not load cart. Please try again."))
      .finally(() => setCartLoading(false));
  }, []);

  // (Optional) Fetch user shipping info from backend
  useEffect(() => {
    fetch("http://localhost:5000/api/user/shipping-info")
      .then(res => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then(data => {
        setFullName(data.name || "");
        setAddress(data.address || "");
        setMobile(data.mobile || "");
      })
      .catch(() => {/* Fill as blank if error */});
  }, []);

  const totalBill = cartItems.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0);

  const handleOrder = async () => {
    setOrderSending(true);
    setOrderMessage("");
    const orderPayload = {
      customer: {
        name: fullName,
        address,
        mobile,
      },
      cartItems,
      totalBill,
    };
    try {
      const res = await fetch("http://localhost:5000/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload),
      });
      if (!res.ok) throw new Error();
      setOrderMessage("Order placed successfully!");
      // You can also clear form/cart or redirect after success here
    } catch {
      setOrderMessage("Order failed. Try again.");
    }
    setOrderSending(false);
  };

  return (
    <Container fluid className="min-vh-100 d-flex align-items-center justify-content-center p-2" style={{ background: "#f9f9f9" }}>
      <Row className="w-100 justify-content-center align-items-center">
        <Col xs={12} md={10} lg={8} xl={6} className="mx-auto">
          <h2 className="mb-4 text-center fw-bold">
            Shree Shyam Enterprises
          </h2>
          <Card className="p-4 shadow-sm">
            <ButtonGroup className="mb-4 w-100">
              <Button
                variant={tab === "shipping" ? "primary" : "outline-primary"}
                onClick={() => setTab("shipping")}
                style={{ width: "33%" }}
              >
                Shipping Address
              </Button>
              <Button
                variant={tab === "bill" ? "primary" : "outline-primary"}
                onClick={() => setTab("bill")}
                style={{ width: "33%" }}
              >
                Total Bill
              </Button>
              <Button
                variant={tab === "order" ? "primary" : "outline-primary"}
                onClick={() => setTab("order")}
                style={{ width: "34%" }}
              >
                Place Order
              </Button>
            </ButtonGroup>

            {/* Shipping Address Form */}
            {tab === "shipping" && (
              <Form>
                <h4>Enter Shipping Address</h4>
                <Form.Group className="mb-3">
                  <Form.Label>Full Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter your name"
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Address</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    placeholder="Enter address"
                    value={address}
                    onChange={e => setAddress(e.target.value)}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Mobile Number</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter mobile number"
                    value={mobile}
                    onChange={e => setMobile(e.target.value)}
                    required
                  />
                </Form.Group>
              </Form>
            )}

            {/* Order Summary */}
            {tab === "bill" && (
              <div>
                <h4>Order Summary</h4>
                {cartLoading ? (
                  <div className="text-center"><Spinner animation="border" /></div>
                ) : cartError ? (
                  <Alert variant="danger">{cartError}</Alert>
                ) : cartItems.length === 0 ? (
                  <div className="text-muted">Your cart is empty.</div>
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
              </div>
            )}

            {/* Place Order Page */}
            {tab === "order" && (
              <div>
                <h4>Place Your Order</h4>
                <p>
                  <b>Name:</b> {fullName ? fullName : <span className="text-danger">Not provided</span>}<br />
                  <b>Shipping Address:</b> {address ? address : <span className="text-danger">Not provided</span>}<br />
                  <b>Mobile:</b> {mobile ? mobile : <span className="text-danger">Not provided</span>}
                </p>
                <p>
                  <b>Total:</b> ₹{totalBill}
                </p>
                {orderMessage && <Alert variant={orderMessage.includes("success") ? "success" : "danger"}>{orderMessage}</Alert>}
                <Button
                  variant="success"
                  className="w-100"
                  onClick={handleOrder}
                  disabled={orderSending || !!cartError || cartLoading}
                >
                  {orderSending ? "Placing..." : "Confirm Order"}
                </Button>
              </div>
            )}
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default CheckoutPage;