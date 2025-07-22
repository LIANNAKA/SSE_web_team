import React, { useState, useEffect } from "react";
import { Container, Card, Form, Button, Spinner, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const CheckoutShipping = () => {
  const [form, setForm] = useState({
    name: "",
    address: "",
    mobile: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Fetch shipping info from backend on mount
  useEffect(() => {
    fetch("http://localhost:5000/api/user/shipping-info")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load shipping info");
        return res.json();
      })
      .then((data) => {
        setForm({
          name: data.name || "",
          address: data.address || "",
          mobile: data.mobile || ""
        });
      })
      .catch(() => {
        setError("Could not fetch shipping info. Please enter manually.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleNext = (e) => {
    e.preventDefault();
    localStorage.setItem("checkoutShipping", JSON.stringify(form));
    navigate("/checkout/bill");
  };

  return (
    <Container className="min-vh-100 d-flex align-items-center justify-content-center p-2" style={{ background: "#f9f9f9" }}>
      <Card className="p-4 shadow-sm w-100" style={{ maxWidth: 480 }}>
        <h2 className="mb-4 text-center fw-bold">Shipping Address</h2>

        {loading ? (
          <div className="text-center"><Spinner animation="border" /></div>
        ) : (
          <Form onSubmit={handleNext}>
            {error && <Alert variant="warning">{error}</Alert>}
            <Form.Group className="mb-3">
              <Form.Label>Full Name</Form.Label>
              <Form.Control name="name" value={form.name} onChange={handleChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Address</Form.Label>
              <Form.Control as="textarea" rows={2} name="address" value={form.address} onChange={handleChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Mobile Number</Form.Label>
              <Form.Control name="mobile" value={form.mobile} onChange={handleChange} required />
            </Form.Group>
            <Button type="submit" variant="primary" className="w-100">Continue to Bill</Button>
          </Form>
        )}
      </Card>
    </Container>
  );
};

export default CheckoutShipping;